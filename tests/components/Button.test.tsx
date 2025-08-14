import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock component - you can replace this with your actual Button component
const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary' 
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant}`}
    data-testid="button"
  >
    {children}
  </button>
)

describe('Button Component', () => {
  it('renders with correct text', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByTestId('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Click me</Button>)
    
    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('applies correct variant class', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} variant="secondary">Click me</Button>)
    
    expect(screen.getByTestId('button')).toHaveClass('btn-secondary')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Click me</Button>)
    
    fireEvent.click(screen.getByTestId('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})