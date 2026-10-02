export default function DemoBanner() {
    return (
        <div
            role="status"
            className="sticky top-16 z-30 w-full bg-primary-fixed text-on-primary-fixed text-sm px-4 md:px-8 lg:px-10 py-2 text-center"
        >
            Estás usando la cuenta demo. Los datos son compartidos y pueden
            restaurarse.
        </div>
    );
}