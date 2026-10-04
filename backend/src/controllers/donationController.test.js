const { getMyClaimsHandler } = require('./donationController');
const donationService = require('../services/donationService');

jest.mock('../services/donationService');

describe('Donation Controller - getMyClaimsHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('TEST 13 - valid NGO returns 200', async () => {
    req.appUser = { _id: 'valid-ngo-id', role: 'NGO' };
    const mockClaims = [{ _id: 'claim1' }];
    donationService.getMyClaims.mockResolvedValue(mockClaims);

    await getMyClaimsHandler(req, res, next);

    expect(donationService.getMyClaims).toHaveBeenCalledWith('valid-ngo-id');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockClaims,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('TEST 13 - missing ngoId handles error (throws 400 from service)', async () => {
    req.appUser = { _id: 'ngo-1', role: 'NGO' };
    // Controller just passes to service, service throws
    const error = new Error('ngoId is required');
    error.status = 400;
    donationService.getMyClaims.mockRejectedValue(error);

    await getMyClaimsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('TEST 13 - invalid ngoId handles error (throws 400 from service)', async () => {
    req.appUser = { _id: 'invalid', role: 'NGO' };
    const error = new Error('Invalid ngoId format');
    error.status = 400;
    donationService.getMyClaims.mockRejectedValue(error);

    await getMyClaimsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('TEST 13 - valid DONOR handles error (throws 403 from service)', async () => {
    req.appUser = { _id: 'donor-id', role: 'NGO' };
    const error = new Error('User is not an NGO');
    error.status = 403;
    donationService.getMyClaims.mockRejectedValue(error);

    await getMyClaimsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('TEST 13 - nonexistent user handles error (throws 404 from service)', async () => {
    req.appUser = { _id: 'nonexistent-id', role: 'NGO' };
    const error = new Error('User not found');
    error.status = 404;
    donationService.getMyClaims.mockRejectedValue(error);

    await getMyClaimsHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('Donation Controller - markReadyForPickupHandler', () => {
  let req, res, next;
  const { markReadyForPickupHandler } = require('./donationController');

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('Valid markReadyForPickup returns 200', async () => {
    req.params.donationId = 'donation-1';
    req.appUser = { _id: 'donor-1', role: 'DONOR' };
    
    const mockResult = { _id: 'donation-1', status: 'READY_FOR_PICKUP' };
    donationService.markReadyForPickup.mockResolvedValue(mockResult);

    await markReadyForPickupHandler(req, res, next);

    expect(donationService.markReadyForPickup).toHaveBeenCalledWith('donation-1', 'donor-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Donation marked as ready for pickup',
      data: { donation: mockResult }
    });
  });

  test('Error cascades to next', async () => {
    req.appUser = { _id: 'donor-1', role: 'DONOR' };
    const error = new Error('Test error');
    donationService.markReadyForPickup.mockRejectedValue(error);

    await markReadyForPickupHandler(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('Donation Controller - markPickedUpHandler', () => {
  let req, res, next;
  const { markPickedUpHandler } = require('./donationController');

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('Valid markPickedUp returns 200', async () => {
    req.params.donationId = 'donation-1';
    req.appUser = { _id: 'ngo-1', role: 'NGO' };
    
    const mockResult = { _id: 'donation-1', status: 'PICKED_UP' };
    donationService.markPickedUp.mockResolvedValue(mockResult);

    await markPickedUpHandler(req, res, next);

    expect(donationService.markPickedUp).toHaveBeenCalledWith('donation-1', 'ngo-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Donation marked as picked up',
      data: { donation: mockResult }
    });
  });

  test('Error cascades to next', async () => {
    req.appUser = { _id: 'ngo-1', role: 'NGO' };
    const error = new Error('Test error');
    donationService.markPickedUp.mockRejectedValue(error);

    await markPickedUpHandler(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('Spoofing Protection Tests', () => {
  let req, res, next;
  const { 
    createDonationHandler, 
    getMyDonationsHandler, 
    claimDonationHandler 
  } = require('./donationController');

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('createDonationHandler ignores body.donorId and uses req.appUser._id', async () => {
    req.appUser = { _id: 'DONOR_A', role: 'DONOR' };
    req.body = { donorId: 'DONOR_B', foodName: 'Test Food' };
    donationService.createDonation.mockResolvedValue({});

    await createDonationHandler(req, res, next);

    expect(donationService.createDonation).toHaveBeenCalledWith({
      foodName: 'Test Food',
      donorId: 'DONOR_A'
    });
  });

  test('getMyDonationsHandler ignores query.donorId and uses req.appUser._id', async () => {
    req.appUser = { _id: 'DONOR_A', role: 'DONOR' };
    req.query = { donorId: 'DONOR_B' };
    donationService.getMyDonations.mockResolvedValue([]);

    await getMyDonationsHandler(req, res, next);

    expect(donationService.getMyDonations).toHaveBeenCalledWith('DONOR_A');
  });

  test('claimDonationHandler ignores body.ngoId and uses req.appUser._id', async () => {
    req.appUser = { _id: 'NGO_A', role: 'NGO' };
    req.params = { donationId: 'donation-1' };
    req.body = { ngoId: 'NGO_B' };
    donationService.claimDonation.mockResolvedValue({});

    await claimDonationHandler(req, res, next);

    expect(donationService.claimDonation).toHaveBeenCalledWith('donation-1', 'NGO_A');
  });
});

