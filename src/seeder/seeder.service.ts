import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CatalogsService } from '../catalogs/catalogs.service';
import { Catalog } from '../catalogs/schemas/catalog.schema';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly catalogsService: CatalogsService,
  ) {}

  async seedSystemUser(): Promise<UserResponseDto> {
    const name = this.configService.get<string>('SYSTEM_ADMIN_NAME');
    const email = this.configService.get<string>('SYSTEM_ADMIN_EMAIL');
    const password = this.configService.get<string>('SYSTEM_ADMIN_PASSWORD');

    if (!name || !email || !password) {
      throw new Error(
        'Missing SYSTEM_ADMIN_* environment variables for seeding.',
      );
    }

    this.logger.log(`Ensuring system user exists for ${email}`);
    const user = await this.usersService.ensureSystemUser(
      name,
      email.toLowerCase(),
      password,
    );
    this.logger.log(`System user ready with email ${user.email}`);

    return user;
  }

  async seedCatalogs(): Promise<void> {
    const catalogs: Catalog[] = [
      {
        category: 'livestock',
        key: 'poultry',
        name: 'Poultry',
        badgeIcon: 'linked_services',
        badgeLabel: 'Vision + sensors',
        description:
          'Layers, broilers, and breeders with feed, vaccination, labour, and camera telemetry logged automatically.',
        metrics: [
          { label: 'Active groups', value: '5' },
          { label: 'Avg mortality', value: '3.4%' },
          { label: 'Output / day', value: '780 eggs' },
          { label: 'Expense burn', value: '₦312k' },
        ],
        coverageValue: 82,
        coverageLabel: '82% networked',
        chips: ['Vision', 'Feed lines', 'Water dosing'],
        actionLabel: 'New group',
        order: 1,
      },
      {
        category: 'livestock',
        key: 'cattle',
        name: 'Cattle',
        badgeIcon: 'sensors',
        badgeLabel: 'Herd GPS',
        description:
          'Dairy and beef herds with RFID, pasture rotations, and vet records tied to milk or liveweight revenues.',
        metrics: [
          { label: 'Active groups', value: '3' },
          { label: 'Avg mortality', value: '1.2%' },
          { label: 'Output / day', value: '1,250 L' },
          { label: 'Expense burn', value: '₦540k' },
        ],
        coverageValue: 54,
        coverageLabel: '54% networked',
        chips: ['RFID', 'Weight scales', 'Pasture GPS'],
        actionLabel: 'New group',
        order: 2,
      },
      {
        category: 'livestock',
        key: 'goats',
        name: 'Goats',
        badgeIcon: 'schedule',
        badgeLabel: 'Manual + AI',
        description:
          'Meat and dairy herds with body-condition scoring, breeding cycles, and farmer journals digitised by the assistant.',
        metrics: [
          { label: 'Active groups', value: '2' },
          { label: 'Avg mortality', value: '2.7%' },
          { label: 'Output / month', value: '4.2 t' },
          { label: 'Expense burn', value: '₦184k' },
        ],
        coverageValue: 32,
        coverageLabel: '32% networked',
        chips: ['Manual logs', 'Weight bridge'],
        actionLabel: 'New group',
        order: 3,
      },
      {
        category: 'livestock',
        key: 'catfish',
        name: 'Catfish',
        badgeIcon: 'water',
        badgeLabel: 'Water quality',
        description:
          'Pond and tank programs with dissolved oxygen, feed conversion, and biomass tracked alongside harvest sales.',
        metrics: [
          { label: 'Active groups', value: '1' },
          { label: 'Avg mortality', value: '4.0%' },
          { label: 'Harvest cycle', value: '120 d' },
          { label: 'Expense burn', value: '₦96k' },
        ],
        coverageValue: 46,
        coverageLabel: '46% networked',
        chips: ['Dissolved O₂', 'Feed conversion'],
        actionLabel: 'New group',
        order: 4,
      },
      {
        category: 'crops',
        key: 'palm-kernel',
        name: 'Palm kernel bunch',
        badgeIcon: 'satellite_alt',
        badgeLabel: 'Geo plots',
        description:
          'Fresh fruit bunch harvests tracked by plot. Soil analysis, drone imagery, and moisture probes feed the AI to time harvest and factory runs.',
        metrics: [
          { label: 'Active groups', value: '4' },
          { label: 'Yield / ha', value: '14.2 t' },
          { label: 'Expense burn', value: '₦410k' },
          { label: 'AI margin', value: '₦2.6m' },
        ],
        coverageValue: 72,
        coverageLabel: '72% networked',
        chips: ['Drone NDVI', 'Soil probes', 'Weather sync'],
        actionLabel: 'New group',
        order: 1,
      },
      {
        category: 'crops',
        key: 'palm-kernel-truck',
        name: 'Palm kernel truck',
        badgeIcon: 'gps_fixed',
        badgeLabel: 'Logistics',
        description:
          'Capture truck-based harvest, haulage expenses, and weights. Tie into factory delivery windows for oil extraction efficiency.',
        metrics: [
          { label: 'Active groups', value: '3' },
          { label: 'Loads / week', value: '12' },
          { label: 'Transport cost', value: '₦210k' },
          { label: 'Oil yield', value: '7.4 t' },
        ],
        coverageValue: 56,
        coverageLabel: '56% networked',
        chips: ['GPS trucks', 'Weight bridge', 'Factory sync'],
        actionLabel: 'New group',
        order: 2,
      },
      {
        category: 'crops',
        key: 'maize',
        name: 'Maize rainfed',
        badgeIcon: 'thermometer',
        badgeLabel: 'Soil & weather',
        description:
          'Season planning for rainfed maize plots. AI aligns planting dates with rainfall forecasts and tracks weed detection scans.',
        metrics: [
          { label: 'Active groups', value: '5' },
          { label: 'Yield / ha', value: '4.8 t' },
          { label: 'Expense burn', value: '₦180k' },
          { label: 'AI margin', value: '₦1.1m' },
        ],
        coverageValue: 52,
        coverageLabel: '52% networked',
        chips: ['Soil probes', 'Rain model', 'Weed detection'],
        actionLabel: 'New group',
        order: 3,
      },
      {
        category: 'crops',
        key: 'cassava',
        name: 'Cassava irrigation',
        badgeIcon: 'water',
        badgeLabel: 'Automation',
        description:
          'Irrigated cassava blocks with moisture, weed detection, and disease alerts tied to cost vs. yield targets.',
        metrics: [
          { label: 'Active groups', value: '2' },
          { label: 'Cycle progress', value: '42%' },
          { label: 'Expense burn', value: '₦240k' },
          { label: 'AI signal', value: 'Soil saturation' },
        ],
        coverageValue: 48,
        coverageLabel: '48% networked',
        chips: ['Irrigation', 'Weed detection'],
        actionLabel: 'New group',
        order: 4,
      },
      {
        category: 'machinery',
        key: 'harvester-1',
        name: 'Harvester 1',
        badgeIcon: 'sensors',
        badgeLabel: 'Telemetry',
        description:
          'Supports palm kernel truck groups. Track utilisation, fuel burn, and maintenance cadence.',
        metrics: [
          { label: 'Utilisation', value: '64%' },
          { label: 'Status', value: 'Available' },
          { label: 'Fuel burn', value: '18 L/hr' },
          { label: 'Next service', value: 'Due in 12d' },
        ],
        coverageValue: 78,
        coverageLabel: '78% sensor uptime',
        chips: ['Fuel', 'Telemetry'],
        actionLabel: 'Log maintenance',
        order: 1,
      },
      {
        category: 'machinery',
        key: 'feed-line-a2',
        name: 'Feed line A2',
        badgeIcon: 'bolt',
        badgeLabel: 'IoT linked',
        description: 'Supports: Poultry — January group. Track runtime, power, and utilisation.',
        metrics: [
          { label: 'Utilisation', value: '82%' },
          { label: 'Status', value: 'Ready' },
          { label: 'Power', value: 'OK' },
          { label: 'Next service', value: 'Due in 28d' },
        ],
        coverageValue: 92,
        coverageLabel: '92% sensor uptime',
        chips: ['Poultry link', 'Power'],
        actionLabel: 'Log maintenance',
        order: 2,
      },
      {
        category: 'machinery',
        key: 'irrigation-pump',
        name: 'Irrigation pump West',
        badgeIcon: 'water',
        badgeLabel: 'Automation',
        description:
          'Linked to Maize rainfed & Cassava west block. Watch runtime variance and energy use.',
        metrics: [
          { label: 'Utilisation', value: '58%' },
          { label: 'Status', value: 'Maintenance due' },
          { label: 'Energy cost', value: '₦24k/wk' },
          { label: 'Next service', value: 'Overdue' },
        ],
        coverageValue: 48,
        coverageLabel: '48% sensor uptime',
        chips: ['Irrigation', 'Energy'],
        actionLabel: 'Schedule maintenance',
        order: 3,
      },
    ];

    this.logger.log('Seeding catalogs (upsert)...');
    await this.catalogsService.upsertMany(catalogs);
    this.logger.log('Catalogs seed complete.');
  }

  async seedOnStartup(): Promise<void> {
    await this.ensureSystemUserExists();
    await this.ensureCatalogsSeeded();
  }

  private async ensureSystemUserExists(): Promise<void> {
    const name = this.configService.get<string>('SYSTEM_ADMIN_NAME');
    const email = this.configService.get<string>('SYSTEM_ADMIN_EMAIL');
    const password = this.configService.get<string>('SYSTEM_ADMIN_PASSWORD');

    if (!name || !email || !password) {
      this.logger.warn(
        'SYSTEM_ADMIN_* env variables missing; skipping system user auto-seed.',
      );
      return;
    }

    const existing = await this.usersService.findByEmail(email.toLowerCase());
    if (existing) {
      this.logger.log('System user already exists; skipping creation.');
      return;
    }

    await this.seedSystemUser();
  }

  private async ensureCatalogsSeeded(): Promise<void> {
    const count = await this.catalogsService.count();
    if (count > 0) {
      this.logger.log(`Catalogs already seeded (${count}); skipping.`);
      return;
    }
    await this.seedCatalogs();
  }
}
