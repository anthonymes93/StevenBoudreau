const escapeHtml=(str)=>String(str||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=(x,n=2000)=>String(x??'').trim().slice(0,n);
const validEmail=x=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
export async function onRequestPost({request,env}){
  const type=request.headers.get('content-type')||'';
  if(!type.includes('application/json'))return Response.json({error:'Invalid request.'},{status:415});
  let data;try{data=await request.json()}catch{return Response.json({error:'Invalid submission.'},{status:400})}
  const name=safe(data.name,120),email=safe(data.email,180),phone=safe(data.phone,70),message=safe(data.message,4000);
  if(data.website)return Response.json({success:true});
  if(!name||(!email&&!phone)||!message||email&&!validEmail(email))return Response.json({error:'Please enter your name, a valid email or phone number, and your project details.'},{status:400});
  if(!env.RESEND_API_KEY)return Response.json({error:'Contact form is not configured yet. Please call or email us directly.'},{status:503});
  const fields=[['Name',name],['Email',email||'Not provided'],['Phone',phone||'Not provided'],['Property type',safe(data.propertyType,80)],['Project type',safe(data.projectType,180)],['Project location',safe(data.location,180)],['Timeline',safe(data.timeline,100)],['Project details',message]];
  const html=`<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:25px;color:#202a24"><h1 style="font-size:24px">New Boudreau Carpentry enquiry</h1>${fields.map(([k,v])=>`<div style="border-bottom:1px solid #e7e7e7;padding:12px 0"><div style="font-size:11px;letter-spacing:1px;color:#777;text-transform:uppercase">${escapeHtml(k)}</div><div style="margin-top:5px;white-space:pre-wrap">${escapeHtml(v)}</div></div>`).join('')}<p style="margin-top:25px"><a href="${email?'mailto:'+encodeURIComponent(email):'#'}" style="background:#25362a;color:white;padding:12px 18px;text-decoration:none;border-radius:4px">${email?'Reply to customer':'No email provided'}</a> ${phone?`<a href="tel:${escapeHtml(phone.replace(/[^+\d]/g,''))}" style="background:#3d7047;color:white;padding:12px 18px;text-decoration:none;border-radius:4px">Call customer</a>`:''}</p></div>`;
  try{
    const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.CONTACT_FROM_EMAIL||'Boudreau Carpentry <emails@rtuino.com>',to:[env.CONTACT_TO_EMAIL||'stevenboudreau@gmail.com'],subject:'Website Enquiries',...(email?{reply_to:email}:{}),html})});
    if(!result.ok){console.error('Resend failed',result.status,await result.text());return Response.json({error:'We could not send your message right now. Please call or email us directly.'},{status:502})}
    return Response.json({success:true})
  }catch(err){console.error('Contact submission error',err);return Response.json({error:'We could not send your message right now. Please call or email us directly.'},{status:502})}
}
export function onRequestGet(){return new Response('Method Not Allowed',{status:405,headers:{Allow:'POST'}})}