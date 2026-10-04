import * as signalR from '@microsoft/signalr';

export interface OrderCreatedPayload {
  id: string;
  orderNumber: string;
  dispatchRiderId: string;
  pickupVerificationCode: string;
  grandTotal: number;
}

export interface OrderPickedUpPayload {
  orderId: string;
  orderNumber: string;
  pickedUpAt: string;
}

export interface OrderDeliveredPayload {
  orderId: string;
  orderNumber: string;
  deliveredAt: string;
}

export interface RiderLocationUpdatedPayload {
  riderId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;

  public async startConnection(token?: string): Promise<void> {
    if (this.connection && this.isConnected) return;

    const hubUrl = token ? `/hubs/order?access_token=${token}` : '/hubs/order';

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('Connected to SignalR OrderHub successfully.');
    } catch (err) {
      console.warn('SignalR Connection Warning (Fallback mode active):', err);
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.isConnected = false;
    }
  }

  public async joinCustomerChannel(customerId: string): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('JoinCustomerChannel', customerId);
    }
  }

  public async joinRiderChannel(riderId: string): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('JoinRiderChannel', riderId);
    }
  }

  public async joinKitchenChannel(): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.invoke('JoinKitchenChannel');
    }
  }

  public onOrderCreated(callback: (order: OrderCreatedPayload) => void): void {
    this.connection?.on('OrderCreated', callback);
  }

  public onOrderPickedUp(callback: (payload: OrderPickedUpPayload) => void): void {
    this.connection?.on('OrderPickedUp', (orderId: string, orderNumber: string, pickedUpAt: string) => {
      callback({ orderId, orderNumber, pickedUpAt });
    });
  }

  public onOrderDelivered(callback: (payload: OrderDeliveredPayload) => void): void {
    this.connection?.on('OrderDelivered', (orderId: string, orderNumber: string, deliveredAt: string) => {
      callback({ orderId, orderNumber, deliveredAt });
    });
  }

  public onRiderLocationUpdated(callback: (payload: RiderLocationUpdatedPayload) => void): void {
    this.connection?.on('RiderLocationUpdated', (riderId: string, latitude: number, longitude: number, timestamp: string) => {
      callback({ riderId, latitude, longitude, timestamp });
    });
  }
}

export const signalRService = new SignalRService();
