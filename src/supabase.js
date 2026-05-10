import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qgcxxtkbzphpruokngdo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY3h4dGtienBocHJ1b2tuZ2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjU0MzcsImV4cCI6MjA5MzU0MTQzN30.tKcH0YyAYW-dmoHEluXkysP0VPUFlO2bPCHMfFBuqOY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── 사업자 프로필 저장 ─────────────────────────────────────────
export const saveBusinessProfile = async (userId, profile) => {
  const { error } = await supabase
    .from('business_profiles')
    .upsert({
      id: userId,
      type: profile.type,
      name: profile.name,
      biz_name: profile.bizName || null,
      industry: profile.industry || null,
      revenue: profile.revenue || null,
      employees: profile.employees || null,
      concerns: profile.concerns || [],
      field: profile.field || null,
      has_idea: profile.hasIdea || false,
      idea: profile.idea || null,
      ready_stage: profile.readyStage || null,
      capital: profile.capital || null,
      job: profile.job || null,
      updated_at: new Date().toISOString(),
    })
  if (error) console.error('프로필 저장 오류:', error)
  return !error
}

// ── 프로필 불러오기 ────────────────────────────────────────────
export const getBusinessProfile = async (userId) => {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

// ── 연락처 저장 ────────────────────────────────────────────────
export const saveContact = async (userId, contact) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: userId,
      name: contact.name,
      company: contact.company || null,
      type: contact.type,
      last_message: contact.lastMsg,
      amount: contact.amount || null,
      tags: contact.tags || [],
      unread: true,
    })
    .select()
    .single()
  if (error) console.error('연락처 저장 오류:', error)
  return data
}

// ── 연락처 불러오기 ────────────────────────────────────────────
export const getContacts = async (userId) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

// ── 할 일 저장 ─────────────────────────────────────────────────
export const saveTodo = async (userId, todo) => {
  const { data, error } = await supabase
    .from('todos')
    .insert({
      user_id: userId,
      contact_name: todo.contact,
      text: todo.text,
      done: false,
      date: todo.date,
    })
    .select()
    .single()
  if (error) console.error('할 일 저장 오류:', error)
  return data
}

// ── 할 일 불러오기 ─────────────────────────────────────────────
export const getTodos = async (userId) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

// ── 할 일 완료 처리 ────────────────────────────────────────────
export const updateTodo = async (todoId, done) => {
  const { error } = await supabase
    .from('todos')
    .update({ done })
    .eq('id', todoId)
  if (error) console.error('할 일 업데이트 오류:', error)
  return !error
}

// ── AI 대화 저장 ───────────────────────────────────────────────
export const saveMessage = async (userId, agentId, role, content) => {
  const { error } = await supabase
    .from('ai_messages')
    .insert({ user_id: userId, agent_id: agentId, role, content })
  if (error) console.error('메시지 저장 오류:', error)
  return !error
}

// ── AI 대화 불러오기 ───────────────────────────────────────────
export const getMessages = async (userId, agentId) => {
  const { data, error } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('agent_id', agentId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data
}