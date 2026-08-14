// // lib/db/dashdata.js
// import { getDashDataCollection } from '../mongodb';

// /**
//  * Get user dashboard data
//  * @param {string} userId - User ID
//  * @returns {Promise<Object|null>}
//  */
// export async function getUserDashboard(userId) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     let dashData = await dashDataCollection.findOne({ userId });
    
//     if (!dashData) {
//       dashData = await createDefaultDashboard(userId);
//     }
    
//     return dashData;
//   } catch (error) {
//     console.error('Error getting user dashboard:', error);
//     return null;
//   }
// }

// /**
//  * Create default dashboard data for new user
//  * @param {string} userId - User ID
//  * @returns {Promise<Object>}
//  */
// export async function createDefaultDashboard(userId) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     const defaultData = {
//       userId,
//       bills: [],
//       recentTransactions: [],
//       paymentMethods: [],
//       preferences: {
//         theme: 'light',
//         notifications: true,
//         currency: 'USD',
//       },
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
//     const result = await dashDataCollection.insertOne(defaultData);
//     return { ...defaultData, _id: result.insertedId };
//   } catch (error) {
//     console.error('Error creating default dashboard:', error);
//     throw error;
//   }
// }

// /**
//  * Add bill to user dashboard
//  * @param {string} userId - User ID
//  * @param {Object} billData - Bill data
//  * @returns {Promise<boolean>}
//  */
// export async function addBill(userId, billData) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     const newBill = {
//       id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
//       ...billData,
//       status: billData.status || 'unpaid',
//       createdAt: new Date(),
//     };
//     const result = await dashDataCollection.updateOne(
//       { userId },
//       { 
//         $push: { bills: newBill },
//         $set: { updatedAt: new Date() }
//       }
//     );
//     return result.modifiedCount > 0;
//   } catch (error) {
//     console.error('Error adding bill:', error);
//     throw error;
//   }
// }

// /**
//  * Update bill status
//  * @param {string} userId - User ID
//  * @param {string} billId - Bill ID
//  * @param {string} status - New status ('paid', 'unpaid', 'overdue')
//  * @returns {Promise<boolean>}
//  */
// export async function updateBillStatus(userId, billId, status) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     const updateData = {
//       'bills.$.status': status,
//       updatedAt: new Date(),
//     };
    
//     if (status === 'paid') {
//       updateData['bills.$.paidDate'] = new Date();
//     }
    
//     const result = await dashDataCollection.updateOne(
//       { userId, 'bills.id': billId },
//       { $set: updateData }
//     );
//     return result.modifiedCount > 0;
//   } catch (error) {
//     console.error('Error updating bill status:', error);
//     throw error;
//   }
// }

// /**
//  * Delete a bill
//  * @param {string} userId - User ID
//  * @param {string} billId - Bill ID
//  * @returns {Promise<boolean>}
//  */
// export async function deleteBill(userId, billId) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     const result = await dashDataCollection.updateOne(
//       { userId },
//       { 
//         $pull: { bills: { id: billId } },
//         $set: { updatedAt: new Date() }
//       }
//     );
//     return result.modifiedCount > 0;
//   } catch (error) {
//     console.error('Error deleting bill:', error);
//     throw error;
//   }
// }

// /**
//  * Add transaction to user dashboard
//  * @param {string} userId - User ID
//  * @param {Object} transactionData - Transaction data
//  * @returns {Promise<boolean>}
//  */
// export async function addTransaction(userId, transactionData) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     const newTransaction = {
//       id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
//       ...transactionData,
//       date: new Date(),
//       status: transactionData.status || 'completed',
//     };
//     const result = await dashDataCollection.updateOne(
//       { userId },
//       { 
//         $push: { 
//           recentTransactions: { 
//             $each: [newTransaction], 
//             $position: 0, 
//             $slice: 20 
//           } 
//         },
//         $set: { updatedAt: new Date() }
//       }
//     );
//     return result.modifiedCount > 0;
//   } catch (error) {
//     console.error('Error adding transaction:', error);
//     throw error;
//   }
// }

// /**
//  * Get upcoming bills (unpaid and due soon)
//  * @param {string} userId - User ID
//  * @returns {Promise<Array>}
//  */
// export async function getUpcomingBills(userId) {
//   try {
//     const dashData = await getUserDashboard(userId);
//     if (!dashData || !dashData.bills) return [];
    
//     const now = new Date();
//     const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
//     return dashData.bills
//       .filter(bill => 
//         bill.status === 'unpaid' && 
//         new Date(bill.dueDate) <= thirtyDaysFromNow
//       )
//       .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
//   } catch (error) {
//     console.error('Error getting upcoming bills:', error);
//     return [];
//   }
// }

// /**
//  * Get recent paid bills
//  * @param {string} userId - User ID
//  * @param {number} limit - Maximum number to return
//  * @returns {Promise<Array>}
//  */
// export async function getRecentPaidBills(userId, limit = 10) {
//   try {
//     const dashData = await getUserDashboard(userId);
//     if (!dashData || !dashData.bills) return [];
    
//     return dashData.bills
//       .filter(bill => bill.status === 'paid')
//       .sort((a, b) => new Date(b.paidDate || b.dueDate) - new Date(a.paidDate || a.dueDate))
//       .slice(0, limit);
//   } catch (error) {
//     console.error('Error getting recent paid bills:', error);
//     return [];
//   }
// }

// /**
//  * Get all bills across all users (admin only)
//  * @param {number} limit - Maximum number to return
//  * @returns {Promise<Array>}
//  */
// export async function getAllBills(limit = 100) {
//   try {
//     const dashDataCollection = await getDashDataCollection();
//     const allDashData = await dashDataCollection
//       .find({})
//       .limit(limit)
//       .toArray();
    
//     const allBills = [];
//     allDashData.forEach(dash => {
//       if (dash.bills) {
//         dash.bills.forEach(bill => {
//           allBills.push({
//             ...bill,
//             userId: dash.userId,
//           });
//         });
//       }
//     });
    
//     return allBills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   } catch (error) {
//     console.error('Error getting all bills:', error);
//     return [];
//   }
// }
// lib/db/dashdata.js
import { getDashDataCollection } from '../mongodb';

/**
 * Get user dashboard data
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>}
 */
export async function getUserDashboard(userId) {
  try {
    const dashDataCollection = await getDashDataCollection();
    let dashData = await dashDataCollection.findOne({ userId });
    
    if (!dashData) {
      dashData = await createDefaultDashboard(userId);
    } else {
      // ✅ SAFE FALLBACK: Ensure newly required fields exist for older documents
      // This prevents undefined errors and ensures hydration succeeds on the frontend
      let needsUpdate = false;
      const updateData = {};

      if (!dashData.totalBalance) {
        updateData.totalBalance = { amount: "0.00", change: "0.0%" };
        needsUpdate = true;
      }
      if (!dashData.analysisBalance) {
        updateData.analysisBalance = { total: "0.00", stocks: "45%", crypto: "35%", etfs: "20%" };
        needsUpdate = true;
      }

      // If the old database document was missing fields, patch them in-place atomically
      if (needsUpdate) {
        updateData.updatedAt = new Date();
        await dashDataCollection.updateOne(
          { userId },
          { $set: updateData }
        );
        // Merge the new defaults into the returned object so the API request doesn't fail
        dashData = { ...dashData, ...updateData };
      }
    }
    
    return dashData;
  } catch (error) {
    console.error('Error getting user dashboard:', error);
    return null;
  }
}

/**
 * Create default dashboard data for new user
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
export async function createDefaultDashboard(userId) {
  try {
    const dashDataCollection = await getDashDataCollection();
    const defaultData = {
      userId,
      // ✅ NEW FIELDS ADDED HERE (Hydration safe)
      totalBalance: {
        amount: "0.00",
        change: "0.0%"
      },
      analysisBalance: {
        total: "0.00",
        stocks: "45%",
        crypto: "35%",
        etfs: "20%"
      },
      bills: [
        {
          id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          name: "gas fee",
          amount: 30.00,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: "pending",
          category: "General"
        }
      ],
      recentTransactions: [],
      paymentMethods: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await dashDataCollection.insertOne(defaultData);
    return { ...defaultData, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating default dashboard:', error);
    throw error;
  }
}

/**
 * Add bill to user dashboard
 * @param {string} userId - User ID
 * @param {Object} billData - Bill data
 * @returns {Promise<boolean>}
 */
export async function addBill(userId, billData) {
  try {
    const dashDataCollection = await getDashDataCollection();
    const newBill = {
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...billData,
      status: billData.status || 'unpaid',
      createdAt: new Date(),
    };
    const result = await dashDataCollection.updateOne(
      { userId },
      { 
        $push: { bills: newBill },
        $set: { updatedAt: new Date() }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error adding bill:', error);
    throw error;
  }
}

/**
 * Update bill status
 * @param {string} userId - User ID
 * @param {string} billId - Bill ID
 * @param {string} status - New status ('paid', 'unpaid', 'overdue')
 * @returns {Promise<boolean>}
 */
export async function updateBillStatus(userId, billId, status) {
  try {
    const dashDataCollection = await getDashDataCollection();
    const updateData = {
      'bills.$.status': status,
      updatedAt: new Date(),
    };
    
    if (status === 'paid') {
      updateData['bills.$.paidDate'] = new Date();
    }
    
    const result = await dashDataCollection.updateOne(
      { userId, 'bills.id': billId },
      { $set: updateData }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating bill status:', error);
    throw error;
  }
}

/**
 * Delete a bill
 * @param {string} userId - User ID
 * @param {string} billId - Bill ID
 * @returns {Promise<boolean>}
 */
export async function deleteBill(userId, billId) {
  try {
    const dashDataCollection = await getDashDataCollection();
    const result = await dashDataCollection.updateOne(
      { userId },
      { 
        $pull: { bills: { id: billId } },
        $set: { updatedAt: new Date() }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
}

/**
 * Add transaction to user dashboard
 * @param {string} userId - User ID
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<boolean>}
 */
export async function addTransaction(userId, transactionData) {
  try {
    const dashDataCollection = await getDashDataCollection();
    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...transactionData,
      date: new Date(),
      status: transactionData.status || 'completed',
    };
    const result = await dashDataCollection.updateOne(
      { userId },
      { 
        $push: { 
          recentTransactions: { 
            $each: [newTransaction], 
            $position: 0, 
            $slice: 20 
          } 
        },
        $set: { updatedAt: new Date() }
      }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

/**
 * Get upcoming bills (unpaid and due soon)
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export async function getUpcomingBills(userId) {
  try {
    const dashData = await getUserDashboard(userId);
    if (!dashData || !dashData.bills) return [];
    
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return dashData.bills
      .filter(bill => 
        bill.status === 'unpaid' && 
        new Date(bill.dueDate) <= thirtyDaysFromNow
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } catch (error) {
    console.error('Error getting upcoming bills:', error);
    return [];
  }
}

/**
 * Get recent paid bills
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number to return
 * @returns {Promise<Array>}
 */
export async function getRecentPaidBills(userId, limit = 10) {
  try {
    const dashData = await getUserDashboard(userId);
    if (!dashData || !dashData.bills) return [];
    
    return dashData.bills
      .filter(bill => bill.status === 'paid')
      .sort((a, b) => new Date(b.paidDate || b.dueDate) - new Date(a.paidDate || a.dueDate))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent paid bills:', error);
    return [];
  }
}

/**
 * Get all bills across all users (admin only)
 * @param {number} limit - Maximum number to return
 * @returns {Promise<Array>}
 */
export async function getAllBills(limit = 100) {
  try {
    const dashDataCollection = await getDashDataCollection();
    const allDashData = await dashDataCollection
      .find({})
      .limit(limit)
      .toArray();
    
    const allBills = [];
    allDashData.forEach(dash => {
      if (dash.bills) {
        dash.bills.forEach(bill => {
          allBills.push({
            ...bill,
            userId: dash.userId,
          });
        });
      }
    });
    
    return allBills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting all bills:', error);
    return [];
  }
}