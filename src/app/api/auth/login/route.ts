// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { sign } from 'jsonwebtoken';
// import { connectDB } from '@/lib/db';
// import User from '@/models/User';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// // In a real application, these would be stored in a database with hashed passwords
// const USERS = {
//   admin: {
//     name: 'Admin User',
//     email: 'admin@railway.com',
//     password: 'admin123',
//     role: 'admin'
//   },
//   worker: {
//     name: 'Worker User',
//     email: 'worker@railway.com',
//     password: 'worker123',
//     role: 'worker'
//   }
// };

// export async function POST(request: Request) {
//   try {
//     const { email, password, role } = await request.json();

//     // Validate required fields
//     if (!email || !password || !role) {
//       return NextResponse.json(
//         { message: 'Email, password and role are required' },
//         { status: 400 }
//       );
//     }

//     // Find user by role and validate credentials
//     const user = Object.values(USERS).find(
//       (u) => u.email === email && u.password === password && u.role === role
//     );

//     if (!user) {
//       return NextResponse.json(
//         { message: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     try {
//       // Connect to database and create/update user
//       await connectDB();
      
//       // Find or create user in database
//       let dbUser = await User.findOne({ email: user.email });
//       if (!dbUser) {
//         dbUser = new User({
//           name: user.name,
//           email: user.email,
//           password: user.password, // In a real app, this should be hashed
//           role: user.role,
//           status: 'available',
//           lastActive: new Date()
//         });
//         await dbUser.save();
//       }
//     } catch (dbError) {
//       console.error('Database error:', dbError);
//       // Continue even if database operations fail
//     }

//     // Generate JWT token
//     const token = sign(
//       { email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Create the response with cookies
//     const response = NextResponse.json({
//       user: {
//         email: user.email,
//         role: user.role,
//         name: user.name
//       },
//       message: 'Login successful'
//     });

//     // Set cookies
//     const cookieOptions = {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax' as const,
//       maxAge: 86400, // 1 day
//       path: '/dashboard/login/?admin=true'
//     };

//     response.cookies.set('token', token, cookieOptions);
//     response.cookies.set('userRole', user.role, cookieOptions);

//     return response;

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// } 
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { sign } from 'jsonwebtoken';
// import { connectDB } from '@/lib/db';
// import User from '@/models/User';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     await connectDB();
//     const user = await User.findOne({ email });

//     if (!user || user.password !== password) {
//       return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
//     }

//     const token = sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

//     const response = NextResponse.json({
//       user: { email: user.email, role: user.role, name: user.name },
//       message: 'Login successful'
//     });

//     // **🔥 Clear previous session**
//     response.cookies.set('token', '', { expires: new Date(0) });
//     response.cookies.set('userRole', '', { expires: new Date(0) });

//     // **🔥 Set new session**
//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 86400
//     });

//     response.cookies.set('userRole', user.role, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 86400
//     });

//     return response;

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await connectDB();
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({
      user: { email: user.email, role: user.role, name: user.name },
      message: 'Login successful'
    });

    // **🔥 Clear previous session**
    response.cookies.set('token', '', { expires: new Date(0) });
    response.cookies.set('userRole', '', { expires: new Date(0) });

    // **🔥 Set new session**
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400
    });

    response.cookies.set('userRole', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}