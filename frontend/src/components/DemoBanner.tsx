export default function DemoBanner() {
    return (
        <div
            role="status"
            className="w-full bg-secondary-container text-on-secondary-container text-xs px-4 md:px-8 lg:px-10 py-1.5 text-center"
        >
            Estás usando la cuenta demo. Los datos son compartidos y pueden
            restaurarse.
        </div>
    );
}