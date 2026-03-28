import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useSocketEvents = (events, dependencies = []) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Đăng ký các event listeners
    const eventEntries = Object.entries(events);
    eventEntries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      eventEntries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, ...dependencies]);
};