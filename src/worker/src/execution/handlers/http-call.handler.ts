import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NodeResult } from '../../shared/types/node-result.interface';

@Injectable()
export class HttpCallHandler {
  async handle(config: any): Promise<NodeResult> {
    const { url, method, headers, payload } = config;
    if (!url) {
      return { status: 'failed', error: 'HTTP URL is missing' };
    }

    try {
      const response = await axios({
        url,
        method: method || 'GET',
        headers: headers || {},
        data: payload,
        timeout: parseInt(process.env.HTTP_CALL_TIMEOUT_MS || '30000', 10),
      });

      return {
        status: 'success',
        output: {
          statusCode: response.status,
          data: response.data,
          headers: response.headers,
        },
      };
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      const message = error.message;
      
      // Throw to trigger BullMQ automatic job retry
      throw new Error(
        `HTTP Call failed (Status ${status || 'unknown'}): ${message}. Response: ${JSON.stringify(data || {})}`
      );
    }
  }
}
