export const isNumeric = (val: string) : boolean => {
    return !isNaN(Number(val));
}