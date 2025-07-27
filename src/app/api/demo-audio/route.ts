import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 3초간의 멜로디가 있는 데모 음악 생성 (WAV 형식)
    const demoBuffer = generateDemoMusic();
    
    return new NextResponse(demoBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': demoBuffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating demo audio:', error);
    
    // 폴백: 간단한 톤 생성
    const beepBuffer = generateBeepSound();
    
    return new NextResponse(beepBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': beepBuffer.length.toString(),
        'Accept-Ranges': 'bytes',
      },
    });
  }
}

// 멜로디가 있는 데모 음악 생성 함수
function generateDemoMusic(): Buffer {
  const sampleRate = 44100;
  const duration = 5; // 5초
  const amplitude = 0.2;
  
  // 간단한 멜로디 (C 메이저 스케일)
  const notes = [
    { freq: 261.63, start: 0, duration: 0.5 }, // C4
    { freq: 293.66, start: 0.5, duration: 0.5 }, // D4
    { freq: 329.63, start: 1, duration: 0.5 }, // E4
    { freq: 349.23, start: 1.5, duration: 0.5 }, // F4
    { freq: 392.00, start: 2, duration: 0.5 }, // G4
    { freq: 440.00, start: 2.5, duration: 0.5 }, // A4
    { freq: 493.88, start: 3, duration: 0.5 }, // B4
    { freq: 523.25, start: 3.5, duration: 1.5 }, // C5 (longer)
  ];
  
  const samples = sampleRate * duration;
  const buffer = Buffer.alloc(44 + samples * 2); // WAV header + data
  
  // WAV header
  writeWavHeader(buffer, samples, sampleRate);
  
  // Generate audio samples
  for (let i = 0; i < samples; i++) {
    const time = i / sampleRate;
    let sample = 0;
    
    // Add each note if it should be playing at this time
    for (const note of notes) {
      if (time >= note.start && time < note.start + note.duration) {
        const noteProgress = (time - note.start) / note.duration;
        const envelope = Math.sin(noteProgress * Math.PI); // Simple envelope
        sample += Math.sin(2 * Math.PI * note.freq * time) * amplitude * envelope;
      }
    }
    
    // Add some harmonics for richer sound
    sample += Math.sin(2 * Math.PI * 523.25 * time * 0.5) * amplitude * 0.3 * Math.sin(time * 2);
    
    // Clamp and convert to integer
    sample = Math.max(-1, Math.min(1, sample));
    const intSample = Math.round(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }
  
  return buffer;
}

// 간단한 beep 소리 생성 함수 (폴백용)
function generateBeepSound(): Buffer {
  const sampleRate = 44100;
  const duration = 3; // 3초
  const frequency = 440; // A4 note
  const amplitude = 0.3;
  
  const samples = sampleRate * duration;
  const buffer = Buffer.alloc(44 + samples * 2); // WAV header + data
  
  writeWavHeader(buffer, samples, sampleRate);
  
  // Generate sine wave
  for (let i = 0; i < samples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * amplitude;
    const intSample = Math.round(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }
  
  return buffer;
}

// WAV 헤더 작성 함수
function writeWavHeader(buffer: Buffer, samples: number, sampleRate: number) {
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + samples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(samples * 2, 40);
}