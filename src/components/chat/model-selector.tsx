import { useQuery } from '@tanstack/react-query'
import { Loader2Icon } from 'lucide-react'
import { memo } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { ModelResponse } from 'ollama/browser'
import { Route } from '@/routes/chat'

type IModelSelectorProps = {
  selectedModel: string
  onChange: (model: string) => void
}

const ModelSelector = memo(
  ({ selectedModel, onChange }: IModelSelectorProps) => {
    const { allModelsQueryOptions } = Route.useRouteContext()
    const { data: { models: allModels } = { models: [] } } = useQuery(
      allModelsQueryOptions,
    )
    const { pending } = useFormStatus()

    const groupedModels = Object.entries(
      allModels.reduce(
        (acc, curr) => {
          const family = curr.details.family
          const grouping = acc[family]
          return { ...acc, [family]: grouping ? grouping.concat(curr) : [curr] }
        },
        {} as Record<string, Array<ModelResponse> | undefined>,
      ),
    ).map(([family, models]) => (
      <DropdownMenuContent key={family + '-model-selector'} className="w-56">
        <DropdownMenuLabel>{family}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedModel} onValueChange={onChange}>
          {models?.map((m) => (
            <DropdownMenuRadioItem key={m.name} value={m.name}>
              {m.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    ))

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={pending}>
            {pending && <Loader2Icon />} Model: {selectedModel}
          </Button>
        </DropdownMenuTrigger>
        {groupedModels}
      </DropdownMenu>
    )
  },
)

export default ModelSelector
