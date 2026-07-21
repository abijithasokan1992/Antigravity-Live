const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const inputVideo = path.join(__dirname, 'movie.mp4');
const outputDir = path.join(__dirname, 'public', 'stream');
const keyFile = path.join(outputDir, 'enc.key');
const keyInfoFile = path.join(__dirname, 'enc.keyinfo');
const playlistFile = path.join(outputDir, 'master.m3u8');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("🔒 Starting Local DRM Encryption Process...");

// 1. Generate a 16-byte AES encryption key
console.log("Generating AES-128 encryption key...");
const key = crypto.randomBytes(16);
fs.writeFileSync(keyFile, key);

// 2. Create the key info file for FFmpeg
// Format: 
// Key URI (How the player accesses it)
// Path to key file (How FFmpeg accesses it)
const keyUri = "http://localhost:4000/admin/stream/enc.key";
fs.writeFileSync(keyInfoFile, `${keyUri}\n${keyFile}\n`);

// 3. Check if movie.mp4 exists
if (!fs.existsSync(inputVideo)) {
  console.error("❌ Error: 'movie.mp4' not found in the backend folder.");
  console.log("👉 Action Required: Place your movie file in the 'backend' folder and name it 'movie.mp4', then run 'node encrypt.js' again.");
  process.exit(1);
}

// 4. Run FFmpeg command to slice and encrypt
console.log("🎬 Encrypting and segmenting video (this may take a while depending on video length)...");

// FFmpeg command for HLS with AES-128 encryption
const ffmpegCmd = `ffmpeg -i "${inputVideo}" -c:v copy -c:a copy -hls_time 10 -hls_key_info_file "${keyInfoFile}" -hls_playlist_type vod -hls_segment_filename "${path.join(outputDir, 'segment_%03d.ts')}" "${playlistFile}"`;

exec(ffmpegCmd, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ FFmpeg Error:", error.message);
    console.log("Make sure FFmpeg is installed and added to your system PATH.");
    return;
  }
  
  // Cleanup temp keyinfo file
  fs.unlinkSync(keyInfoFile);
  
  console.log("✅ Encryption Complete!");
  console.log("Your video is now DRM protected (AES-128 Encrypted HLS).");
  console.log("The encrypted segments and playlist are located in: backend/public/stream/");
  console.log("The frontend player will automatically load it from: http://localhost:4000/admin/stream/master.m3u8");
});
