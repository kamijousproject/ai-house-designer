export function dimsFromPlot(plotW, plotL){
  const bldW = Math.min(plotW*0.8, Math.max(3, plotW-2));
  const bldL = Math.min(plotL*0.7, Math.max(3, plotL-3));
  return { bldW, bldL };
}
export function areas({plotW,plotL,floors=1,floorH=3,roofType='gable'}){
  const { bldW, bldL } = dimsFromPlot(plotW, plotL);
  const constructed = bldW*bldL*floors;
  const usable = constructed*0.85;
  const wallArea = ((bldW*2 + bldL*2) * floorH) * floors * 0.9;
  const roofFactor = (['hip','gable'].includes(roofType))?1.15:(roofType==='shed'?1.1:1.0);
  const roofArea = bldW*bldL*roofFactor;
  return { bldW,bldL,constructed,usable,wallArea,roofArea };
}
export function faceFromAz(az){
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(((az%360)+360)%360/45)%8];
}