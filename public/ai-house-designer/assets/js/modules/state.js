import { toast } from './ui.js';
const KEY_CFG='fs_house_cfg', KEY_ROLE='fs_role', KEY_CRED='fs_credits';
export function getConfig(){ try{return JSON.parse(localStorage.getItem(KEY_CFG))||{};}catch{return{};} }
export function saveConfig(cfg){ localStorage.setItem(KEY_CFG, JSON.stringify(cfg||{})); toast('บันทึกค่าแล้ว','success'); }
export function getRole(){ return localStorage.getItem(KEY_ROLE)||'Owner'; }
export function setRole(r){ localStorage.setItem(KEY_ROLE, r); }
export function getCredits(){ const v=localStorage.getItem(KEY_CRED); return v?parseInt(v,10):10; }
export function setCredits(c){ localStorage.setItem(KEY_CRED, String(Math.max(0, Math.round(c)))); }
export function deductCredits(cost, feature=''){ const cur=getCredits(); if(cur<cost){ toast(`เครดิตไม่พอสำหรับ ${feature||'การใช้งานนี้'}`,'warning'); return false; } setCredits(cur-cost); toast(`หักเครดิต ${cost} แต้ม`,'success'); return true; }