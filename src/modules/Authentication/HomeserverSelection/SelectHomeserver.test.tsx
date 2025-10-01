import { faker } from '@faker-js/faker';
import { meetingTestingConstants } from '@shared/constants';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoDiscovery, createClient, MatrixClient } from 'matrix-js-sdk/src';

import { formatUrl } from 'modules/Matrix/utils';
import * as matrixUtils from 'modules/Matrix/utils';

import SelectHomeserver from './SelectHomeserver';

vi.mock('contexts/MatrixContext/useMatrixContext.ts');
vi.mock('matrix-js-sdk/src', async (importOriginal) => {
  const actual = await importOriginal<typeof import('matrix-js-sdk/src')>();

  return {
    ...actual,
    AutoDiscovery: { getRawClientConfig: vi.fn() },
    createClient: vi.fn(() => ({
      loginFlows: () => Promise.resolve({ flows: [{ type: 'm.login.sso' }] }),
      stopClient: vi.fn(),
    })),
    DELEGATED_OIDC_COMPATIBILITY: { findIn: () => true },
  };
});

describe('Select Homeserver', () => {
  const setup = async () => {
    render(<SelectHomeserver setCustomMatrixUrl={vi.fn()} />);
    const changeButton = screen.getByTestId(meetingTestingConstants.changeMatrixHomeserverButton);
    await userEvent.click(changeButton);

    const matrixHomeserverInput = await screen.findByTestId(meetingTestingConstants.matrixHomeserverInput);

    return { matrixHomeserverInput, changeButton };
  };

  beforeAll(() => {
    process.env.REACT_APP_MATRIX_URL = faker.internet.url();
  });

  it('should open matrix homeserver input when clicked change', async () => {
    const { matrixHomeserverInput } = await setup();
    expect(matrixHomeserverInput).toBeInTheDocument();
  });

  it('should see an error if homeserver URI is invalid', async () => {
    const { matrixHomeserverInput } = await setup();
    vi.mocked(AutoDiscovery.getRawClientConfig).mockResolvedValue({});

    await userEvent.click(matrixHomeserverInput);
    await userEvent.type(matrixHomeserverInput, faker.lorem.word(1));

    const setButton = screen.getByTestId(meetingTestingConstants.setHomeserverButton);
    await userEvent.click(setButton);

    const errorMessage = await screen.findByText('invalid_homeserver_url');
    expect(errorMessage).toBeInTheDocument();

    const matrixHomeserverInDisplay = (await screen.findByTestId(meetingTestingConstants.matrixHomeserverDisplay))
      .textContent;
    expect(matrixHomeserverInDisplay).toBe(formatUrl(process.env.REACT_APP_MATRIX_URL as string, true));
  });

  it('should update matrix homeserver if homeserver URI is valid', async () => {
    const homeserver = faker.internet.url();
    const { matrixHomeserverInput } = await setup();

    vi.spyOn(matrixUtils, 'getHomeserverBaseUrl').mockResolvedValue(homeserver);

    const setButton = await screen.findByTestId(meetingTestingConstants.setHomeserverButton);

    await userEvent.clear(matrixHomeserverInput);
    await userEvent.type(matrixHomeserverInput, homeserver);
    await userEvent.click(setButton);

    const matrixHomeserverInDisplay = (await screen.findByTestId(meetingTestingConstants.matrixHomeserverDisplay))
      .textContent;
    expect(matrixHomeserverInDisplay).toBe(formatUrl(homeserver, true));
  });

  it('set button should be disabled when homeserver input is clear', async () => {
    const { matrixHomeserverInput } = await setup();
    await userEvent.clear(matrixHomeserverInput);

    const setButton = await screen.findByTestId(meetingTestingConstants.setHomeserverButton);
    expect(setButton).toBeDisabled();
  });

  it('set button should be enabled when something is in the homeserver input', async () => {
    const { matrixHomeserverInput } = await setup();
    const homeserver = faker.internet.url();

    await userEvent.clear(matrixHomeserverInput);
    await userEvent.type(matrixHomeserverInput, homeserver);

    const setButton = await screen.findByTestId(meetingTestingConstants.setHomeserverButton);
    expect(setButton).toBeEnabled();
  });

  it('should show error if homeserver does not support OIDC compatibility', async () => {
    const homeserver = faker.internet.url();
    const { matrixHomeserverInput } = await setup();

    vi.spyOn(matrixUtils, 'getHomeserverBaseUrl').mockResolvedValue(homeserver);
    vi.mocked(createClient).mockImplementation(
      () =>
        ({
          loginFlows: () => Promise.resolve({ flows: [{ type: 'm.login.password' }] }),
          stopClient: () => vi.fn(),
        }) as unknown as MatrixClient
    );

    const setButton = await screen.findByTestId(meetingTestingConstants.setHomeserverButton);

    await userEvent.clear(matrixHomeserverInput);
    await userEvent.type(matrixHomeserverInput, homeserver);
    await userEvent.click(setButton);

    const errorMessage = await screen.findByText('delegated_oidc_compatibility_unsupported');
    expect(errorMessage).toBeInTheDocument();

    const matrixHomeserverInDisplay = (await screen.findByTestId(meetingTestingConstants.matrixHomeserverDisplay))
      .textContent;
    expect(matrixHomeserverInDisplay).toBe(formatUrl(process.env.REACT_APP_MATRIX_URL as string, true));
  });
});
