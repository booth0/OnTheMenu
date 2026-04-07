export default function Button({
    children,
    onClick,
    disabled = false,
    type
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type: "primary" | "secondary";
}) {
    return (
        <button onClick={onClick} disabled={disabled} className={type}>
            {children}
        </button>
    );
}