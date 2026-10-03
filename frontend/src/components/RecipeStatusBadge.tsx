import { statusMeta } from "../constants/recipes";
import type { RecipeStatus } from "../types/recipe";

interface RecipeStatusBadgeProps {
    status: RecipeStatus;
}

export default function RecipeStatusBadge({ status }: RecipeStatusBadgeProps) {
    const meta = statusMeta[status];

    return (
        <span
            title={meta.hint}
            className="inline-flex items-center gap-1 rounded-full border border-outline-variant/60 px-2 py-0.5 text-[11px] font-medium text-on-surface-variant"
        >
            <span aria-hidden="true">{meta.emoji}</span>
            {meta.label}
        </span>
    );
}