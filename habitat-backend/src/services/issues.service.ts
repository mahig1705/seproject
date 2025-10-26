import IssuesModel, { IIssues } from '../models/issues.model';

export class IssuesService {
  // Get all issues and populate reporter + technician
  async getAll(): Promise<IIssues[]> {
    return IssuesModel.find()
      .populate('reporter', 'name')
      .populate('technician', 'name'); // populate technician
  }

  // Get single issue by ID
  async getById(id: string): Promise<IIssues | null> {
    return IssuesModel.findById(id)
      .populate('reporter', 'name')
      .populate('technician', 'name');
  }

  // Create a new issue
  async create(data: Partial<IIssues>): Promise<IIssues> {
    const newIssue = await IssuesModel.create(data); // await first
    await newIssue.populate('reporter', 'name');       // populate reporter
    await newIssue.populate('technician', 'name');    // populate technician
    return newIssue;
  }

  // Update issue by ID
  async update(id: string, data: Partial<IIssues>): Promise<IIssues | null> {
    const updatedIssue = await IssuesModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedIssue) return null;
    await updatedIssue.populate('reporter', 'name');
    await updatedIssue.populate('technician', 'name');
    return updatedIssue;
  }

  // Delete issue by ID
  async delete(id: string): Promise<IIssues | null> {
    return IssuesModel.findByIdAndDelete(id);
  }
}
