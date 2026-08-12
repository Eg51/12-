// // app/api/auth/login/route.js
// import { NextResponse } from 'next/server';
// import { getUserByEmail, updateUser } from '@/lib/db/users';
// import { 
//   checkLoginAttempts, 
//   incrementLoginAttempts, 
//   resetLoginAttempts,
//   isValidEmail,
//   generateToken,
//   getRemainingAttempts
// } from '@/lib/security';
// import bcrypt from 'bcryptjs';

// export const runtime = 'nodejs';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     if (!isValidEmail(email)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     const attemptCheck = await checkLoginAttempts(email);
    
//     if (!attemptCheck.allowed) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: attemptCheck.message || 'Account locked',
//           remainingAttempts: 0,
//           lockedUntil: attemptCheck.lockedUntil,
//         },
//         { status: 429 }
//       );
//     }

//     const user = await getUserByEmail(email);

//     if (!user) {
//       await incrementLoginAttempts(email);
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'Invalid credentials',
//           remainingAttempts: await getRemainingAttempts(email),
//         },
//         { status: 401 }
//       );
//     }

//     if (!user.isActive) {
//       return NextResponse.json(
//         { success: false, error: 'Account is deactivated' },
//         { status: 403 }
//       );
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
    
//     if (!isValidPassword) {
//       await incrementLoginAttempts(email);
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'Invalid credentials',
//           remainingAttempts: await getRemainingAttempts(email),
//         },
//         { status: 401 }
//       );
//     }

//     await resetLoginAttempts(email);

//     const token = generateToken({
//       id: user._id.toString(),
//       email: user.email,
//       name: user.name,
//       role: user.role || 'user',
//       isAdmin: user.role === 'admin',
//     });

//     await updateUser(user._id.toString(), {
//       lastLogin: new Date(),
//       loginCount: (user.loginCount || 0) + 1,
//     });

//     const { password: _, ...userWithoutPassword } = user;

//     return NextResponse.json({
//       success: true,
//       message: 'Login successful',
//       user: {
//         ...userWithoutPassword,
//         id: userWithoutPassword._id.toString(),
//         _id: undefined,
//       },
//       token,
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { getUserByEmail, getUserByUsername, updateUser } from '@/lib/db/users'; // assuming you have an updateUser function
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
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 🔒 CHECK ACCOUNT LOCKOUT
    const now = new Date();
    if (user.lockUntil && new Date(user.lockUntil) > now) {
      return NextResponse.json(
        { error: 'Account locked. Please try again later.', remainingAttempts: 0 },
        { status: 429 } // 429 status triggers the "Account Locked" state in your frontend
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
          remainingAttempts: remaining, // ⬅️ Returned to frontend
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
 
    // ✅ (Optional) Generate a refreshed token if your security requires it


    // 🟢 FIXED: Replaced {...} with the valid token payload
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

    // 🚀 Ensure isAdmin is explicitly sent for frontend redirect logic
    const userResponse = {
      ...userWithoutPassword,
      isAdmin: user.role === 'admin'
    };

    const response = NextResponse.json({
      success: true,
      token,
      refreshedToken, // ⬅️ Added this for your frontend
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