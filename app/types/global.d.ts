declare interface Window {
  ajaxRequest: (frame: any, eventName: string, params: string[]) => void;
  MainForm: {
    UniURLFrame1: any; // Substitua `any` pelo tipo correto, se conhecido
  };
}
