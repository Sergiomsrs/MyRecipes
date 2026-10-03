interface FavoriteButtonProps {
    favorite: boolean;
    onToggle: () => void;
    label?: string;
}

export default function FavoriteButton({
    favorite,
    onToggle,
    label = "Marcar como favorita",
}: FavoriteButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={favorite}
            aria-label={favorite ? "Quitar de favoritas" : label}
            title={favorite ? "Quitar de favoritas" : label}
            className={`shrink-0 p-2 -mr-1 transition-colors ${favorite
                    ? "text-amber-500 hover:text-amber-600"
                    : "text-on-surface-variant/50 hover:text-amber-500"
                }`}
        >
            <svg
                className="w-5 h-5"
                fill={favorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={favorite ? 0 : 1.6}
                viewBox="0 0 24 24"
            >
                <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
}