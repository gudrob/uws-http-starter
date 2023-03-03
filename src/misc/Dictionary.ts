/**
 * A helper type for object literals
 */
export default interface Dictionary<T> {
    [Key: string]: T;
}