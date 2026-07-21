import { useState } from "react";

interface AttemptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating?: number, notes?: string) => void;
}

export default function AttemptModal({
    isOpen,
    onClose,
    onSubmit,
}: AttemptModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
        onSubmit(rating, notes);
        setRating(5);
        setNotes("");
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 pointer-events-none">
                <div className="card w-full md:max-w-lg rounded-t-2xl md:rounded-2xl border-b-0 md:border-b pointer-events-auto">
                    <div className="flex justify-center pt-3 pb-1 md:hidden">
                        <div className="w-10 h-1 bg-border rounded-full" />
                    </div>

                    <div className="px-5 md:px-6 pb-6 pt-2 md:pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-text">
                                ¿Cómo salió esta vez?
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 text-text-muted hover:text-text active:text-text transition-colors"
                                aria-label="Cerrar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition-colors ${
                                            star <= rating ? "text-accent-orange" : "text-border"
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <p className="text-center font-mono text-xs text-text-muted mt-2">
                                {rating}/5
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="section-label block mb-2">Notas</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="input-field input-field--block resize-none"
                                rows={4}
                                placeholder="¿Qué cambiaste? ¿Qué harías distinto la próxima vez?"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 text-text-muted font-medium hover:text-text active:text-text transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex-1 py-3 btn-gradient"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
