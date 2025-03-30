interface OTPData {
  otp: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
}

class TempStorage {
  private static instance: TempStorage;
  private storage: Map<string, OTPData>;

  private constructor() {
    this.storage = new Map();
    // Clean up expired OTPs every minute
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): TempStorage {
    if (!TempStorage.instance) {
      TempStorage.instance = new TempStorage();
    }
    return TempStorage.instance;
  }

  public set(key: string, data: OTPData): void {
    this.storage.set(key, data);
  }

  public get(key: string): OTPData | undefined {
    const data = this.storage.get(key);
    if (data && data.expiresAt < new Date()) {
      this.storage.delete(key);
      return undefined;
    }
    return data;
  }

  public delete(key: string): void {
    this.storage.delete(key);
  }

  private cleanup(): void {
    const now = new Date();
    // Convert to array to avoid issues with older JavaScript targets
    Array.from(this.storage.keys()).forEach(key => {
      const data = this.storage.get(key);
      if (data && data.expiresAt < now) {
        this.storage.delete(key);
      }
    });
  }
}

export const tempStorage = TempStorage.getInstance(); 