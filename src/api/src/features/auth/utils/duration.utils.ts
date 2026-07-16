import { Injectable } from '@nestjs/common';

@Injectable()
export class DurationUtils {
  /**
   * Mengubah durasi (string deskriptif, string numerik, atau number) menjadi milidetik.
   */
  parseToMs(duration: string | number): number {
    if (typeof duration === 'number') {
      return duration;
    }

    if (/^\d+$/.test(duration)) {
      return parseInt(duration, 10);
    }

    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Format durasi tidak valid: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error(`Unit durasi tidak valid: ${unit}`);
    }
  }

  /**
   * Mengubah durasi menjadi detik (satuan standar jsonwebtoken).
   */
  parseToSec(duration: string | number): number {
    return Math.floor(this.parseToMs(duration) / 1000);
  }
}
