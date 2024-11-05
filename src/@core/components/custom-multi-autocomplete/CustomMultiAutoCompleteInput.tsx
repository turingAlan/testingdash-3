// Components Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

type CustomMultiAutoCompleteInputProp = {
  error?: boolean
  helperText?: string
  options: { key: string; label: string }[]
  onChange: (value: any) => void
  value: any[]
}

const CustomMultiAutoCompleteInput = ({ options, onChange, ...rest }: CustomMultiAutoCompleteInputProp) => {
  return (
    <CustomAutocomplete
      id='autocomplete-grouped'
      multiple
      {...rest}
      value={Array.isArray(rest.value) ? rest.value : []}
      getOptionLabel={option => option.label || ''}
      isOptionEqualToValue={(option, value) => {
        const optionKey = option?.key ?? option

        return value === optionKey
      }}
      renderInput={params => <CustomTextField {...params} label='Quality Checklist' {...rest} />}
      options={options.sort((a, b) => -b.label.localeCompare(a.label))}
      onChange={(_, newValue) => {
        if (Array.isArray(newValue)) {
          onChange(newValue)
        }
      }}
    />
  )
}

export default CustomMultiAutoCompleteInput
