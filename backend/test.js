const { spawn } = require('child_process');

const prompt = 'Write a short story about a dragon';

const ollama = spawn('ollama', ['run', 'llama2']);

ollama.stdin.write(prompt + '\n');
ollama.stdin.end();

let output = '';

ollama.stdout.on('data', (data) => {
  output += data.toString();
});

ollama.stderr.on('data', (data) => {
  console.error('❌ STDERR:', data.toString());
});

ollama.on('close', (code) => {
  console.log('✅ Exit code:', code);
  console.log('✅ Output:\n', output.trim());
});
