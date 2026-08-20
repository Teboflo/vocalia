export const units = [
  {id:"u1", title:"Descubre tu voz", subtitle:"Fundamentos", lessons:[
    {id:"l1", title:"Respiración", type:"breathing", xp:20},
    {id:"l2", title:"Conoce tu nota", type:"pitch", xp:30},
    {id:"l3", title:"Primera afinación", type:"choice", xp:30}
  ]},
  {id:"u2", title:"Afinación", subtitle:"Control y precisión", lessons:[
    {id:"l4", title:"Reconoce notas", type:"choice", xp:35},
    {id:"l5", title:"Mantén la nota", type:"pitch", xp:40},
    {id:"l6", title:"Intervalos", type:"choice", xp:45}
  ]},
  {id:"u3", title:"Ritmo y expresión", subtitle:"Canta con intención", lessons:[
    {id:"l7", title:"Pulso", type:"choice", xp:40},
    {id:"l8", title:"Dinámica", type:"choice", xp:45}
  ]}
];

export const missions = [
  {id:"warmup", icon:"🫁", title:"Haz un calentamiento", target:1, reward:20},
  {id:"tuning", icon:"🎯", title:"Completa 2 ejercicios", target:2, reward:40},
  {id:"xp", icon:"⚡", title:"Gana 50 XP", target:50, reward:30}
];