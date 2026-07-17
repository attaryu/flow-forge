import { Injectable, Logger } from '@nestjs/common';
import { RedisProvider } from '../../../shared/providers/redis/redis.provider';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);

  constructor(private readonly redisProvider: RedisProvider) {}

  /**
   * Berlangganan ke channel Redis Pub/Sub untuk workflow run tertentu
   * dan mengalirkan event-event tersebut sebagai SSE stream.
   */
  subscribeToRunEvents(runId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();
    
    // Gunakan client Redis baru khusus untuk subscribe (Pub/Sub melarang command non-pubsub di koneksi yang sama)
    const subClient = this.redisProvider.client.duplicate();
    const channel = `workflow-run:${runId}`;
    let isClosed = false;

    const cleanup = async () => {
      if (isClosed) return;
      isClosed = true;
      try {
        await subClient.unsubscribe(channel);
      } catch (err) {
        // Abaikan error jika koneksi sudah terputus
      }
      try {
        subClient.disconnect();
      } catch (err) {
        // Abaikan error jika koneksi sudah terputus
      }
      this.logger.log(`Cleaned up SSE subscription for runId=${runId}`);
    };

    subClient.subscribe(channel, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to Redis channel ${channel}: ${err.message}`);
        subject.error(err);
        return;
      }
      this.logger.log(`Subscribed to Redis channel ${channel} for SSE`);
    });

    subClient.on('message', (chan, message) => {
      if (chan === channel) {
        try {
          const parsedMessage = JSON.parse(message);
          subject.next({
            data: parsedMessage,
          } as MessageEvent);

          // Jika workflow selesai, tutup stream setelah jeda singkat
          if (parsedMessage.type === 'workflow_done') {
            setTimeout(() => {
              subject.complete();
              cleanup();
            }, 1000);
          }
        } catch (err: any) {
          this.logger.error(`Error parsing message from channel ${channel}: ${err.message}`);
        }
      }
    });

    // Cleanup saat client/browser putus koneksi
    return new Observable<MessageEvent>((observer) => {
      const subscription = subject.subscribe(observer);
      
      return () => {
        subscription.unsubscribe();
        cleanup();
      };
    });
  }
}
