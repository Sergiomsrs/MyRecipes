import { useState } from "react";
import type { RecipeVersion } from "../types/recipe";

interface VersionTimelineProps {
    versions: RecipeVersion[];
    currentVersionId: string;
    selectedVersionId: string;
    onSelectVersion: (version: RecipeVersion) => void;
    isLoading: boolean;
    collapsible?: boolean;
}

export default function VersionTimeline({
    versions,
    currentVersionId,
    selectedVersionId,
    onSelectVersion,
    isLoading,
    collapsible = false,
}: VersionTimelineProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const sorted = [...versions].sort(
        (a, b) => b.versionNumber - a.versionNumber
    );

    const selectedVersion = sorted.find((v) => v.id === selectedVersionId);

    if (isLoading) {
        return (
            <div className="py-4">
                <p className="text-sm text-on-surface-variant">
                    Cargando historial...
                </p>
            </div>
        );
    }

    if (sorted.length === 0) {
        return null;
    }

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    /* Collapsed view for mobile accordion */
    if (collapsible && !isExpanded && selectedVersion) {
        return (
            <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center justify-between gap-3 card px-4 py-3 text-left"
                aria-expanded={false}
                aria-label="Mostrar historial de versiones"
            >
                <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">
                            v{selectedVersion.versionNumber}
                        </span>
                        {selectedVersion.id === currentVersionId && (
                            <span className="text-[10px] font-mono font-semibold text-primary bg-primary-fixed/60 px-1.5 py-0.5 rounded-full">
                                actual
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-on-surface-variant leading-snug truncate mt-0.5">
                        {selectedVersion.summaryChanges || "Versión inicial"}
                        {selectedVersion.rating && (
                            <span className="ml-2 text-tertiary font-semibold">
                                {selectedVersion.rating}/10
                            </span>
                        )}
                    </p>
                </div>
                <svg
                    className="w-4 h-4 text-on-surface-variant shrink-0 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
        );
    }

    /* Full timeline (desktop sidebar OR expanded mobile accordion) */
    return (
        <nav aria-label="Historial de versiones">
            <div className="flex items-center justify-between mb-3">
                <p className="section-label">Historial</p>
                {collapsible && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="text-xs text-primary font-semibold hover:underline"
                        aria-expanded={true}
                    >
                        Ocultar
                    </button>
                )}
            </div>
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-outline-variant" />

                <ul className="space-y-1">
                    {sorted.map((version) => {
                        const isCurrent =
                            version.id === currentVersionId;
                        const isSelected =
                            version.id === selectedVersionId;
                        const date = formatDate(version.createdAt);

                        return (
                            <li key={version.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectVersion(version);
                                        if (collapsible) setIsExpanded(false);
                                    }}
                                    className={`relative w-full text-left pl-6 py-2.5 pr-3 rounded-lg transition-colors ${
                                        isSelected
                                            ? "bg-primary-fixed/40"
                                            : "hover:bg-surface-container-low"
                                    }`}
                                >
                                    {/* Timeline dot */}
                                    <span
                                        className={`absolute left-0 top-[14px] w-[15px] h-[15px] rounded-full border-2 transition-colors ${
                                            isCurrent
                                                ? "bg-primary border-primary"
                                                : isSelected
                                                  ? "bg-primary-fixed border-primary"
                                                  : "bg-surface border-outline-variant"
                                        }`}
                                    />

                                    <div className="flex items-baseline gap-2 mb-0.5">
                                        <span
                                            className={`font-mono text-xs font-semibold ${
                                                isCurrent
                                                    ? "text-primary"
                                                    : "text-on-surface"
                                            }`}
                                        >
                                            v{version.versionNumber}
                                        </span>
                                        {isCurrent && (
                                            <span className="text-[10px] font-mono font-semibold text-primary bg-primary-fixed/60 px-1.5 py-0.5 rounded-full">
                                                actual
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-on-surface-variant leading-snug line-clamp-2">
                                        {version.summaryChanges ||
                                            "Versión inicial"}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] text-on-surface-variant/70">
                                            {date}
                                        </span>
                                        {version.rating && (
                                            <span className="text-[11px] text-tertiary font-semibold">
                                                {version.rating}/10
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
