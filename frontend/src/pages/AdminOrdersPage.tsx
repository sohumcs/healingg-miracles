
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getOrders, updateOrderStatus } from '@/services/orderService';
import { isAdmin } from '@/services/authService';
import { Order } from '@/types';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
      toast({
        title: "Access Denied",
        description: "You must be an administrator to access this page.",
        variant: "destructive"
      });
    }
  }, [navigate, toast]);
  
  // Query orders
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrders
  });
  
  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: Order['status'] }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Status Updated",
        description: "The order status has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update order status: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateStatusMutation.mutate({ orderId, status });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Orders</h2>
          <p className="text-red-500">{(error as Error).message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healing-brown"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>₹{parseFloat(order.total.toString()).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Update Status <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(order.id, 'processing')}
                              >
                                Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(order.id, 'paid')}
                              >
                                Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(order.id, 'shipped')}
                              >
                                Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(order.id, 'delivered')}
                              >
                                Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                              >
                                Cancelled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
