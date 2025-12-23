// import { NextRequest, NextResponse } from 'next/server'
// import dbConnect from '@/lib/mongodb'
// import File from '@/models/File'
// import { uploadToCloudinary } from '@/lib/cloudinary'

// export const dynamic = 'force-dynamic'
// export const maxDuration = 60 // Max duration in seconds
// export const runtime = 'nodejs' // Use Node.js runtime for better compatibility

// // Disable Next.js body parsing to handle large files
// export const config = {
//     api: {
//         bodyParser: false,
//         responseLimit: false,
//     },
// }

// export async function POST(request: NextRequest) {
//     try {
//         await dbConnect()

//         const formData = await request.formData()
//         const file = formData.get('file') as Blob
//         const collegeName = formData.get('collegeName') as string
//         const courseName = formData.get('courseName') as string
//         const year = formData.get('year') as string
//         const branch = formData.get('branch') as string
//         const fileType = formData.get('fileType') as string
//         const semester = formData.get('semester') as string
//         const paperType = formData.get('paperType') as string

//         if (!file) {
//             return NextResponse.json({ error: 'No file provided' }, { status: 400 })
//         }

//         // Check file size (50MB limit for Vercel)
//         const maxSize = 50 * 1024 * 1024 // 50MB
//         if (file.size > maxSize) {
//             return NextResponse.json(
//                 { error: 'File too large. Maximum size is 50MB' },
//                 { status: 413 }
//             )
//         }

//         // Validate required fields
//         const requiredFields = [collegeName, courseName, year, branch, fileType, semester, paperType]
//         if (requiredFields.some(field => !field)) {
//             return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
//         }

//         // Get file name
//         const fileName = (file as any).name || 'upload'

//         // Convert file to buffer
//         const bytes = await file.arrayBuffer()
//         const buffer = Buffer.from(bytes)

//         // Upload to Cloudinary with error handling
//         let uploadResult
//         try {
//             console.log(`Starting upload for file: ${fileName}, size: ${file.size} bytes`)
//             console.log('Cloudinary config check:', {
//                 hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
//                 hasApiKey: !!process.env.CLOUDINARY_API_KEY,
//                 hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
//                 cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET'
//             })
            
//             uploadResult = await uploadToCloudinary(
//                 buffer,
//                 fileName,
//                 `${collegeName}/${courseName}/${fileType}`
//             )
//             console.log('Upload successful:', uploadResult.public_id)
//         } catch (cloudinaryError: any) {
//             console.error('Cloudinary upload error:', cloudinaryError)
            
//             // Return user-friendly error messages
//             let errorMessage = 'Failed to upload file to cloud storage'
//             let helpfulHint = 'Please contact support if this issue persists'
            
//             if (cloudinaryError.message?.includes('credentials') || cloudinaryError.message?.includes('Unauthorized')) {
//                 errorMessage = 'Cloud storage authentication failed'
//                 helpfulHint = 'Administrator: Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel environment variables'
//             } else if (cloudinaryError.message?.includes('limit') || cloudinaryError.message?.includes('quota')) {
//                 errorMessage = 'Cloud storage quota exceeded'
//                 helpfulHint = 'Administrator: Check your Cloudinary account usage at https://cloudinary.com/console'
//             } else if (cloudinaryError.message?.includes('timeout')) {
//                 errorMessage = 'Upload timeout - file may be too large'
//                 helpfulHint = 'Try uploading a smaller file or check your internet connection'
//             } else if (cloudinaryError.message?.includes('invalid JSON') || cloudinaryError.message?.includes('500')) {
//                 errorMessage = 'Cloud storage service error'
//                 helpfulHint = 'Administrator: Verify your Cloudinary account is active and credentials are correct'
//             }
            
//             return NextResponse.json(
//                 { 
//                     error: errorMessage,
//                     details: cloudinaryError.message || 'Unknown cloudinary error',
//                     hint: helpfulHint
//                 },
//                 { status: 500 }
//             )
//         }

//         // Save to database
//         const newFile = new File({
//             collegeName,
//             courseName,
//             year,
//             branch,
//             fileType,
//             fileName: fileName,
//             originalFileName: fileName,
//             fileUrl: uploadResult.secure_url,
//             cloudinaryPublicId: uploadResult.public_id,
//             semester,
//             paperType,
//         })

//         await newFile.save()

//         return NextResponse.json({
//             success: true,
//             file: newFile,
//         })
//     } catch (error: any) {
//         console.error('Upload error:', error)
//         return NextResponse.json(
//             { 
//                 error: 'Failed to upload file',
//                 details: error.message || 'Unknown error'
//             },
//             { status: 500 }
//         )
//     }
// }/

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import File from '@/models/File';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Route segment config for App Router
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

// Note: bodyParser config is not needed in App Router
// Next.js 14+ handles formData() automatically

export async function POST(request: NextRequest) {
    console.log('\n\n========================================');
    console.log('📥 UPLOAD API CALLED');
    console.log('========================================');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('🌍 Environment:', process.env.VERCEL_ENV || 'local');
    console.log('\n🔍 CLOUDINARY ENV VARS CHECK:');
    console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? `"${process.env.CLOUDINARY_CLOUD_NAME}"` : '❌ NOT SET');
    console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.substring(0, 8)}***` : '❌ NOT SET');
    console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? `${process.env.CLOUDINARY_API_SECRET.substring(0, 4)}***` : '❌ NOT SET');
    console.log('\n🔍 MONGODB ENV VAR CHECK:');
    console.log('  MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✓' : '❌ NOT SET');
    console.log('========================================\n');
    
    try {
        console.log('🔗 Step 1: Connecting to MongoDB...');
        await dbConnect();
        console.log('✅ MongoDB connected successfully');

        console.log('\n📋 Step 2: Parsing form data...');
        const formData = await request.formData();
        console.log('✅ Form data parsed');
        const file = formData.get('file') as File | null;
        const collegeName = formData.get('collegeName') as string;
        const courseName = formData.get('courseName') as string;
        const year = formData.get('year') as string;
        const branch = formData.get('branch') as string;
        const fileType = formData.get('fileType') as string;
        const semester = formData.get('semester') as string;
        const paperType = formData.get('paperType') as string;

        console.log('\n📝 Form Fields Received:');
        console.log('  File:', file ? `"${file.name}" (${file.size} bytes)` : '❌ NO FILE');
        console.log('  College:', collegeName || '❌ MISSING');
        console.log('  Course:', courseName || '❌ MISSING');
        console.log('  Year:', year || '❌ MISSING');
        console.log('  Branch:', branch || '❌ MISSING');
        console.log('  FileType:', fileType || '❌ MISSING');
        console.log('  Semester:', semester || '❌ MISSING');
        console.log('  PaperType:', paperType || '❌ MISSING');

        if (!file) {
            console.error('❌ ERROR: No file in form data');
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Vercel serverless body limit is ~4.5MB, but we can stream to Cloudinary
        // Set reasonable limit for PDFs
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB' },
                { status: 413 }
            );
        }

        const required = [collegeName, courseName, year, branch, fileType, semester, paperType];
        if (required.some(f => !f)) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }

        const fileName = file.name || 'upload.pdf';
        
        console.log('\n📦 Step 3: Processing file...');
        console.log('  File name:', fileName);
        console.log('  File size:', `${(file.size / 1024).toFixed(2)} KB`);
        console.log('  File type:', file.type || 'unknown');

        console.log('\n🔄 Step 4: Converting to buffer...');
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('✅ Buffer created:', buffer.length, 'bytes');

        console.log('\n☁️ Step 5: Uploading to Cloudinary...');
        console.log('  Folder:', `${collegeName}/${courseName}/${fileType}`);
        console.log('  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('  Starting upload now...');
        
        const uploadResult = await uploadToCloudinary(buffer, fileName, `${collegeName}/${courseName}/${fileType}`);
        
        console.log('\n✅ Step 6: Cloudinary upload SUCCESS!');
        console.log('  Public ID:', uploadResult.public_id);
        console.log('  URL:', uploadResult.secure_url);

        console.log('\n💾 Step 7: Saving to database...');
        const newFile = new File({
            collegeName,
            courseName,
            year,
            branch,
            fileType,
            fileName,
            originalFileName: fileName,
            fileUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            semester,
            paperType,
        });
        console.log('  File document created');

        await newFile.save();
        console.log('✅ File saved to database with ID:', newFile._id);

        console.log('\n🎉 SUCCESS! Upload complete');
        console.log('========================================\n\n');
        
        return NextResponse.json({ success: true, file: newFile });
    } catch (error: any) {
        console.error('\n\n========================================');
        console.error('❌❌❌ UPLOAD FAILED ❌❌❌');
        console.error('========================================');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('\nFull Stack Trace:');
        console.error(error.stack);
        console.error('========================================\n');
        
        // Provide helpful error messages
        let errorMsg = 'Failed to upload file';
        let hint = 'Please try again';
        
        if (error.message?.includes('Cloudinary')) {
            errorMsg = 'Cloud storage error';
            hint = 'Check Cloudinary credentials in Vercel environment variables';
        } else if (error.message?.includes('timeout')) {
            errorMsg = 'Upload timeout';
            hint = 'File may be too large or connection is slow';
        } else if (error.message?.includes('formData') || error.message?.includes('parse')) {
            errorMsg = 'Invalid file format';
            hint = 'Make sure you are uploading a valid PDF file';
        }
        
        return NextResponse.json(
            { 
                error: errorMsg,
                details: error.message || 'Unknown error',
                hint
            },
            { status: 500 }
        );
    }
}