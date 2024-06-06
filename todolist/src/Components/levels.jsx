export function Levels({ user }) {
    return (
        <>
            <span>[Experience bar goes here]</span>
            <span>{user.level ? user.level : 0}</span>
        </>
    );
}
