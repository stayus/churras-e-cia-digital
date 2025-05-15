
import { DeliveryTier } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

export const validateDeliveryTiers = (deliveryTiers: DeliveryTier[]): boolean => {
  // Sort tiers by minDistance to check for gaps
  const sortedTiers = [...deliveryTiers].sort((a, b) => a.minDistance - b.minDistance);
  
  // Check if the first tier starts at 0
  if (sortedTiers[0].minDistance !== 0) {
    toast({
      title: "Faixa inválida",
      description: "A primeira faixa deve começar em 0 km.",
      variant: "destructive"
    });
    return false;
  }
  
  // Check for overlaps or gaps between tiers
  for (let i = 0; i < sortedTiers.length - 1; i++) {
    if (sortedTiers[i].maxDistance !== sortedTiers[i + 1].minDistance) {
      toast({
        title: "Faixas inválidas",
        description: "As faixas de entrega devem ser contínuas, sem sobreposições ou lacunas.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  // Check that min is less than max for each tier
  for (const tier of sortedTiers) {
    if (tier.minDistance >= tier.maxDistance) {
      toast({
        title: "Faixa inválida",
        description: "A distância mínima deve ser menor que a distância máxima em cada faixa.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  return true;
};
