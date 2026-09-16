export default function HeroIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            {/* Book shadow */}
            <ellipse cx="200" cy="310" rx="140" ry="14" fill="#1a1c1e" opacity="0.06" />

            {/* Left page */}
            <path
                d="M196 52 C196 44, 202 38, 210 38 L310 38 C318 38, 324 44, 324 52 L324 268 C324 276, 318 282, 310 282 L210 282 C202 282, 196 276, 196 268 Z"
                fill="#ffffff"
                stroke="#dec0b7"
                strokeWidth="1"
            />

            {/* Right page */}
            <path
                d="M204 52 C204 44, 198 38, 190 38 L90 38 C82 38, 76 44, 76 52 L76 268 C76 276, 82 282, 90 282 L190 282 C198 282, 204 276, 204 268 Z"
                fill="#f9f9fc"
                stroke="#dec0b7"
                strokeWidth="1"
            />

            {/* Book spine */}
            <line x1="200" y1="38" x2="200" y2="282" stroke="#dec0b7" strokeWidth="1.5" />

            {/* Left page - recipe title */}
            <rect x="112" y="62" width="80" height="6" rx="3" fill="#9f3c16" opacity="0.8" />

            {/* Left page - version badge */}
            <rect x="160" y="60" width="28" height="10" rx="5" fill="#4c6544" opacity="0.6" />
            <text x="174" y="68" textAnchor="middle" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="600">v1.3</text>

            {/* Left page - text lines */}
            <rect x="100" y="80" width="96" height="4" rx="2" fill="#dec0b7" opacity="0.6" />
            <rect x="100" y="92" width="88" height="4" rx="2" fill="#dec0b7" opacity="0.6" />
            <rect x="100" y="104" width="92" height="4" rx="2" fill="#dec0b7" opacity="0.6" />

            {/* Left page - section divider */}
            <line x1="100" y1="122" x2="192" y2="122" stroke="#dec0b7" strokeWidth="0.8" opacity="0.5" />

            {/* Left page - ingredients header */}
            <rect x="112" y="134" width="56" height="5" rx="2.5" fill="#4c6544" opacity="0.7" />

            {/* Left page - ingredient items with dots */}
            <circle cx="104" cy="152" r="2.5" fill="#4c6544" opacity="0.5" />
            <rect x="112" y="150" width="72" height="4" rx="2" fill="#dec0b7" opacity="0.5" />

            <circle cx="104" cy="164" r="2.5" fill="#4c6544" opacity="0.5" />
            <rect x="112" y="162" width="64" height="4" rx="2" fill="#dec0b7" opacity="0.5" />

            <circle cx="104" cy="176" r="2.5" fill="#4c6544" opacity="0.5" />
            <rect x="112" y="174" width="80" height="4" rx="2" fill="#dec0b7" opacity="0.5" />

            <circle cx="104" cy="188" r="2.5" fill="#4c6544" opacity="0.5" />
            <rect x="112" y="186" width="60" height="4" rx="2" fill="#dec0b7" opacity="0.5" />

            {/* Right page - small pot */}
            <ellipse cx="260" cy="165" rx="42" ry="8" fill="#bf542c" opacity="0.15" />
            <rect x="222" y="145" width="76" height="22" rx="6" fill="#bf542c" />
            <rect x="218" y="141" width="84" height="8" rx="4" fill="#984300" />
            {/* Pot handles */}
            <rect x="212" y="148" width="10" height="6" rx="3" fill="#984300" />
            <rect x="290" y="148" width="10" height="6" rx="3" fill="#984300" />

            {/* Steam lines */}
            <path d="M244 132 C244 124, 250 124, 250 116 C250 108, 244 108, 244 100" stroke="#984300" strokeWidth="2" strokeLinecap="round" opacity="0.3" fill="none" />
            <path d="M260 128 C260 120, 266 120, 266 112 C266 104, 260 104, 260 96" stroke="#984300" strokeWidth="2" strokeLinecap="round" opacity="0.25" fill="none" />
            <path d="M276 132 C276 124, 282 124, 282 116 C282 108, 276 108, 276 100" stroke="#984300" strokeWidth="2" strokeLinecap="round" opacity="0.2" fill="none" />

            {/* Right page - lines below pot */}
            <rect x="228" y="184" width="64" height="4" rx="2" fill="#dec0b7" opacity="0.5" />
            <rect x="228" y="196" width="56" height="4" rx="2" fill="#dec0b7" opacity="0.5" />

            {/* Right page - version note */}
            <rect x="228" y="210" width="52" height="9" rx="4.5" fill="#9f3c16" opacity="0.12" />
            <text x="254" y="217" textAnchor="middle" fill="#9f3c16" fontSize="5.5" fontFamily="monospace" fontWeight="500" opacity="0.7">v1.2 → v1.3</text>

            {/* Herb decoration - top left */}
            <g opacity="0.7">
                <path d="M60 90 C54 78, 40 76, 36 84 C32 92, 44 98, 60 90Z" fill="#4c6544" />
                <path d="M58 88 C52 80, 46 72, 38 74" stroke="#4c6544" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </g>

            {/* Herb decoration - top right */}
            <g opacity="0.6">
                <path d="M340 70 C346 58, 360 56, 364 64 C368 72, 356 78, 340 70Z" fill="#4c6544" />
                <path d="M342 68 C348 60, 354 52, 362 54" stroke="#4c6544" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </g>

            {/* Herb decoration - bottom right */}
            <g opacity="0.5">
                <path d="M330 250 C338 242, 350 244, 350 254 C350 264, 338 262, 330 250Z" fill="#cdebc1" />
                <path d="M332 250 C340 244, 348 246, 348 254" stroke="#4c6544" strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>

            {/* Small decorative dots */}
            <circle cx="350" cy="160" r="3" fill="#ffdbcf" />
            <circle cx="50" cy="200" r="2.5" fill="#ffdbcf" />
            <circle cx="360" cy="220" r="2" fill="#cdebc1" />
        </svg>
    );
}
