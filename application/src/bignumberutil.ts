function tokenAmountNumberToString(tokenAmount: number): string {
    const roundedTokenAmount = Math.floor(tokenAmount);
    return roundedTokenAmount + "000000000000000000";
}

export default { tokenAmountNumberToString };