import { toast } from 'react-toastify'

const ClickToGetCopied: React.FC<{ dataType?: string; children: React.ReactNode; className?: string }> = ({
  children,
  dataType,
  className
}) => {
  const copyToClipboard = () => {
    const textToCopy = typeof children === 'string' ? children : children?.toString()

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      toast.success(`${dataType ? dataType : 'Successfully'} copied to clipboard!`)
    } else {
      toast.error('Failed to copy!')
    }
  }

  return (
    <>
      <span
        onClick={copyToClipboard}
        className={`hidden sm:inline-block hover:underline cursor-pointer ${className ? className : ''}`}
      >
        {typeof children === 'string' && children.length > 20
          ? `${children.slice(0, 10)}...${children.slice(-10)}`
          : children}
      </span>
      <span
        onClick={copyToClipboard}
        className={`sm:hidden inline-block hover:underline cursor-pointer ${className ? className : ''}`}
      >
        {typeof children === 'string' && children.length > 10
          ? `${children.slice(0, 5)}...${children.slice(-5)}`
          : children}
      </span>
    </>
  )
}

export default ClickToGetCopied
