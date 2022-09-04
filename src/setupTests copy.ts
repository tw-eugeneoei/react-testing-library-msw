import '@testing-library/jest-dom';
import { server } from './msw/browser'

beforeEach(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())