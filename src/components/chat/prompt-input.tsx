import { memo } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '../ui/input'

const PromptInput = memo(() => {
  const { pending } = useFormStatus()

  return <Input name="prompt" disabled={pending} type="text" />
})

export default PromptInput
