// Simple password hashing for demo (use bcrypt in production)
export function hashPassword(password: string): string {
    // Simple hash - NOT secure for production!
    // In production, use bcrypt or argon2
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `hashed_${Math.abs(hash).toString(36)}_${Date.now()}`;
}

export function verifyPassword(password: string, hash: string): boolean {
    // In demo, just check if password is not empty
    // In production, use bcrypt.compare()
    return password.length > 0 && hash.startsWith('hashed_');
}

export function generateToken(): string {
    return `token_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

export function generateResetToken(): string {
    return `reset_${Math.random().toString(36).substr(2, 12)}_${Date.now()}`;
}
