import { useEffect, useRef } from 'react';
import { ArrowLeft, Download, MessageCircle } from 'lucide-react';
import { VisualDisplayProps } from '@/app/constants/interfaces';


export default function VisualDisplay({ emotion, reflection, entry, visualData, onBack, onChat }: VisualDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);

        let animationId: number;
        let time = 0;

        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            alpha: number;
        }> = [];

        const numParticles = Math.floor(visualData.density * 50);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * (visualData.motion_style === 'turbulent' ? 2 : 0.5),
                vy: (Math.random() - 0.5) * (visualData.motion_style === 'turbulent' ? 2 : 0.5),
                size: Math.random() * 30 + 10,
                color: visualData.color_palette[Math.floor(Math.random() * visualData.color_palette.length)],
                alpha: Math.random() * 0.3 + 0.2,
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(250, 250, 249, 0.1)';
            ctx.fillRect(0, 0, rect.width, rect.height);

            particles.forEach((p, i) => {
                if (visualData.motion_style !== 'static') {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > rect.width) p.vx *= -1;
                    if (p.y < 0 || p.y > rect.height) p.vy *= -1;
                }

                const wave = visualData.motion_style === 'flowing'
                    ? Math.sin(time * 0.01 + i * 0.1) * 20
                    : 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y + wave, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha + Math.sin(time * 0.02 + i) * 0.1;
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            time++;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [emotion]);

    const downloadVisual = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `journal-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
            <header className="px-6 py-6 flex justify-between items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-stone-700 border border-stone-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">New Entry</span>
                </button>
                <div className="flex gap-3 ml-auto">
                    <button
                        onClick={onChat}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 backdrop-blur-sm hover:from-amber-200 hover:to-orange-200 transition-all duration-300 text-stone-700 border border-amber-200"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Discuss</span>
                    </button>
                    <button
                        onClick={downloadVisual}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-stone-700 border border-stone-200"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Save Visual</span>
                    </button>
                </div>
            </header>

            <main className="px-6 pb-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                            <h2 className="text-sm font-medium text-stone-500 mb-4">YOUR ENTRY</h2>
                            <p className="text-stone-700 leading-relaxed">{entry}</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                            <h2 className="text-sm font-medium text-stone-500 mb-4">REFLECTION</h2>
                            <p className="text-stone-700 leading-relaxed italic">{reflection}</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                            <h2 className="text-sm font-medium text-stone-500 mb-4">EMOTIONAL PATTERNS</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Primary emotion</span>
                                    <span className="font-medium text-stone-800">{emotion.primaryEmotion}</span>
                                </div>
                                <div className="flex justify-between items-start mt-2">
                                    <span className="text-stone-600">Secondary emotions</span>
                                    <span className="font-medium text-stone-800 text-right max-w-[60%]">
                                        {emotion.secondaryEmotion.join(', ')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Tone</span>
                                    <span className="font-medium text-stone-800">{emotion.tone}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600">Intensity</span>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-6 rounded-full ${i < Math.floor(emotion.intensity * 5)
                                                    ? 'bg-gradient-to-t from-amber-400 to-orange-400'
                                                    : 'bg-stone-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-6 h-fit">
                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
                            <h2 className="text-sm font-medium text-stone-500 mb-4">VISUAL REPRESENTATION</h2>
                            <canvas
                                ref={canvasRef}
                                className="w-full aspect-square rounded-2xl bg-stone-50"
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <p className="text-sm text-stone-500 mt-4 text-center">
                                This visual captures the emotional essence of your day
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
