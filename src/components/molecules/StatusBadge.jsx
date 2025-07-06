import Badge from '@/components/atoms/Badge';

const StatusBadge = ({ status, ...props }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'inactive':
      case 'cancelled':
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} {...props}>
      {status}
    </Badge>
  );
};

export default StatusBadge;