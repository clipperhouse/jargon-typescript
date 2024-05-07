export {};
declare global {
    interface String {
        isRune(): boolean;
        in(map: runeSet): boolean;
        isPunct(): boolean;
        isSpace(): boolean;
        mightBeLeadingPunct(): boolean;
        mightBeMidPunct(): boolean;
    }
}
type runeSet = {
    [rune: string]: boolean;
};
