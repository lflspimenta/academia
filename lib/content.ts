export function lessonText(content:any){
  if(!content) return {intro:'',sections:[],takeaway:''}
  return {
    intro: typeof content.intro==='string'?content.intro:'',
    sections: Array.isArray(content.sections)?content.sections:[],
    case_title: content.case_title || '',
    case_body: content.case_body || '',
    takeaway: content.takeaway || ''
  }
}
