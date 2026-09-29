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
                className="w-full flex items-center justify-between gap-3 border-y border-outline-variant/40 px-1 py-3 text-left"
                aria-expanded={false}
                aria-label="Mostrar historial de versiones"
            >
                <div className="min-w-0">
                    <p className="text-xs text-primary">
                        v{selectedVersion.versionNumber}
                        {selectedVersion.id === currentVersionId && (
                            <span className="text-on-surface-variant">
                                {" "}· actual
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-snug truncate">
                        {selectedVersion.summaryChanges || "Versión inicial"}
                        {selectedVersion.rating && (
                            <span className="ml-2 text-primary tabular-nums">
                                {selectedVersion.rating}/10
                            </span>
                        )}
                    </p>
                </div>
                <svg
                    className="w-4 h-4 text-on-surface-variant shrink-0"
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
            <div className="flex items-center justify-between mb-1">
                <p className="section-label">Historial de versiones</p>
                {collapsible && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                        aria-expanded={true}
                    >
                        Ocultar
                    </button>
                )}
            </div>
            <div className="relative">
                <div className="absolute left-[7px] top-4 bottom-4 w-px bg-outline-variant/50" />

                <ul>
                    {sorted.map((version, index) => {
                        const isCurrent = version.id === currentVersionId;
                        const isSelected = version.id === selectedVersionId;
                        const date = formatDate(version.createdAt);

                        return (
                            <li key={version.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelectVersion(version);
                                        if (collapsible) setIsExpanded(false);
                                    }}
                                    className={`relative w-full text-left pl-5 py-3 -mx-2 px-2 rounded-md transition-colors ${
                                        index > 0
                                            ? "border-t border-outline-variant/40"
                                            : ""
                                    } ${isSelected ? "bg-primary/[0.05]" : "hover:bg-surface-container-low/50"}`}
                                >
                                    <span
                                        className={`absolute left-[4px] top-[19px] size-[7px] rounded-full transition-colors ${
                                            isCurrent
                                                ? "bg-primary"
                                                : "bg-outline-variant"
                                        }`}
                                    />

                                    <p className="text-xs text-primary">
                                        v{version.versionNumber}
                                        {isCurrent && (
                                            <span className="text-on-surface-variant">
                                                {" "}· actual
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-on-surface leading-snug line-clamp-2 mt-0.5">
                                        {version.summaryChanges ||
                                            "Versión inicial"}
                                    </p>
                                    <p className="text-xs text-on-surface-variant/80 mt-0.5 tabular-nums">
                                        {date}
                                        {version.rating && (
                                            <>
                                                {" "}·{" "}
                                                <span className="text-primary">
                                                    {version.rating}/10
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
