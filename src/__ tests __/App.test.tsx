import '@testing-library/jest-dom'
import { render } from "@testing-library/react"
import HomePage from "../pages"

test('demo', () => {
  expect(true).toBe(true)
})

test("Renders the main page", () => {
  render(<HomePage />)
  expect(true).toBeTruthy()
})