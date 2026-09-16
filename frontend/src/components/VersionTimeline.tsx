import type { RecipeVersion } from "../types/recipe";

interface VersionTimelineProps {
    versions: RecipeVersion[];
    currentVersionId: string;
    selectedVersionId: string;
    onSelectVersion: (version: RecipeVersion) => void;
    isLoading: boolean;
}

export default function VersionTimeline({
    versions,
    currentVersionId,
    selectedVersionId,
    onSelectVersion,
    isLoading,
}: VersionTimelineProps) {
    const sorted = [...versions].sort(
        (a, b) => b.versionNumber - a.versionNumber
    );

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

    return (
        <nav aria-label="Historial de versiones">
            <p className="section-label mb-3">Historial</p>
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-outline-variant" />

                <ul className="space-y-1">
                    {sorted.map((version) => {
                        const isCurrent = version.id === currentVersionId;
                        const isSelected = version.id === selectedVersionId;
                        const date = new Date(
                            version.createdAt
                        ).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });

                        return (
                            <li key={version.id}>
                                <button
                                    type="button"
                                    onClick={() => onSelectVersion(version)}
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
