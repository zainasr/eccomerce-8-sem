import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to categories management by default
  redirect('/admin/categories')
}