import {
  Siren,
  ShieldAlert,
  UserRoundSearch,
  Lightbulb,
  Car,
  TrafficCone,
  TriangleAlert,
  Construction,
  Waves,
  CloudRain,
  Mountain,
  UserRoundX,
  CircleHelp,
  type LucideIcon,
} from 'lucide-react'

export const SITUATION_ICONS: Record<string, LucideIcon> = {
  Robo: Siren,
  Violencia: ShieldAlert,
  'Persona Sospechosa': UserRoundSearch,
  'Poca iluminación': Lightbulb,
  Tráfico: Car,
  'Cruce Peligroso': TrafficCone,
  Accidente: TriangleAlert,
  'Vía en mal estado': Construction,
  Inundación: Waves,
  'Lluvias intensas': CloudRain,
  Deslizamiento: Mountain,
  Acoso: UserRoundX,
  'Alta circulación vehicular': Car,
  Otro: CircleHelp,
}

export function situationIcon(label: string): LucideIcon {
  return SITUATION_ICONS[label] ?? CircleHelp
}
