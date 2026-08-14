
// // app/api/auth/login/route.js
// import { NextResponse } from 'next/server';
// import { getUserByEmail, getUserByUsername, updateUser } from '@/lib/db/users'; // assuming you have an updateUser function
// import { comparePassword, generateToken } from '@/lib/security';
// import { saveSession } from '@/lib/session';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { identifier, password } = body;

//     if (!identifier || !password) {
//       return NextResponse.json(
//         { error: 'Missing credentials' },
//         { status: 400 }
//       );
//     }

//     // Try to find by email first, then by username
//     let user = await getUserByEmail(identifier);
//     if (!user) {
//       user = await getUserByUsername(identifier);
//     }

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Account not found, please create an account' },
//         { status: 401 }
//       );
//     }

//     // 🔒 CHECK ACCOUNT LOCKOUT
//     const now = new Date();
//     if (user.lockUntil && new Date(user.lockUntil) > now) {
//       return NextResponse.json(
//         { error: 'Account locked. Please try again later.', remainingAttempts: 0 },
//         { status: 429 } // 429 status triggers the "Account Locked" state in your frontend
//       );
//     }

//     // Verify password
//     const isValid = await comparePassword(password, user.password);
    
//     if (!isValid) {
//       // ❌ Handle failed attempt
//       let attempts = (user.loginAttempts || 0) + 1;
//       let lockUntil = null;
//       let remaining = 5 - attempts;

//       if (attempts >= 5) {
//         lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
//         remaining = 0;
//       }

//       // Update DB with new attempts and lockUntil
//       await updateUser(user._id, { loginAttempts: attempts, lockUntil });

//       return NextResponse.json(
//         { 
//           error: 'Invalid credentials', 
//           remainingAttempts: remaining, // ⬅️ Returned to frontend
//           lockedUntil: lockUntil 
//         },
//         { status: 401 }
//       );
//     }

//     // ✅ SUCCESS - Reset attempts
//     await updateUser(user._id, { loginAttempts: 0, lockUntil: null });

//     // ✅ Generate JWT token
//     const token = generateToken({
//       id: user._id,
//       email: user.email,
//       username: user.username,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       role: user.role,
//     });
 
//     // ✅ (Optional) Generate a refreshed token if your security requires it


//     // 🟢 FIXED: Replaced {...} with the valid token payload
//     const refreshedToken = generateToken({
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     }, { expiresIn: '1h' });

//     // ✅ Create a session
//     const sessionId = await saveSession({
//       userId: user._id.toString(),
//       username: user.username,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       displayName: user.displayName || user.username,
//       userAgent: request.headers.get('user-agent') || '',
//       ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
//     });

//     // ✅ Remove password from response
//     const { password: _, ...userWithoutPassword } = user;

//     // 🚀 Ensure isAdmin is explicitly sent for frontend redirect logic
//     const userResponse = {
//       ...userWithoutPassword,
//       isAdmin: user.role === 'admin'
//     };

//     const response = NextResponse.json({
//       success: true,
//       token,
//       refreshedToken, // ⬅️ Added this for your frontend
//       sessionId,
//       user: userResponse,
//       remainingAttempts: 5, // reset to max attempts
//     });

//     // ✅ Set httpOnly cookie
//     const isSecure = process.env.NODE_ENV === 'production';
//     response.cookies.set('sessionId', sessionId, {
//       httpOnly: true,
//       secure: isSecure,
//       sameSite: 'lax',
//       path: '/',
//       maxAge: 3600, 
//     });

//     return response;

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { getUserByEmail, getUserByUsername, updateUser } from '@/lib/db/users';
import { comparePassword, generateToken } from '@/lib/security';
import { saveSession } from '@/lib/session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    // Try to find by email first, then by username
    let user = await getUserByEmail(identifier);
    if (!user) {
      user = await getUserByUsername(identifier);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found, please create an account' },
        { status: 401 }
      );
    }

    // 🔒 CHECK ACCOUNT LOCKOUT
    const now = new Date();
    if (user.lockUntil && new Date(user.lockUntil) > now) {
      return NextResponse.json(
        { error: 'Account locked. Please try again later.', remainingAttempts: 0 },
        { status: 429 }
      );
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    
    if (!isValid) {
      // ❌ Handle failed attempt
      let attempts = (user.loginAttempts || 0) + 1;
      let lockUntil = null;
      let remaining = 5 - attempts;

      if (attempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
        remaining = 0;
      }

      // Update DB with new attempts and lockUntil
      await updateUser(user._id, { loginAttempts: attempts, lockUntil });

      return NextResponse.json(
        { 
          error: 'Invalid credentials', 
          remainingAttempts: remaining,
          lockedUntil: lockUntil 
        },
        { status: 401 }
      );
    }

    // ✅ SUCCESS - Reset attempts
    await updateUser(user._id, { loginAttempts: 0, lockUntil: null });

    // ✅ Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
 
    // ✅ (Optional) Generate a refreshed token
    const refreshedToken = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    }, { expiresIn: '1h' });

    // ✅ Create a session
    const sessionId = await saveSession({
      userId: user._id.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName || user.username,
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });

    // ✅ Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // ✅ SERIALIZE _id TO STRING & ADD isAdmin CHECK
    const userResponse = {
      ...userWithoutPassword,
      id: user._id.toString(),      // Explicitly force ID to be a string
      _id: user._id.toString(),     // Also keep _id as a string just in case
      isAdmin: user.role === 'admin' // Tell frontend if user is admin
    };

    const response = NextResponse.json({
      success: true,
      token,
      refreshedToken,
      sessionId,
      user: userResponse,
      remainingAttempts: 5, // reset to max attempts
    });

    // ✅ Set httpOnly cookie
    const isSecure = process.env.NODE_ENV === 'production';
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600, 
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}


