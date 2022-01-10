<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\CustomerRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use App\Model\Base;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ORM\Table(name: 'customers')]
class Customer extends Base
{
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected $id;
    #[ORM\Column(type: Types::STRING)]
    protected $name;
    #[ORM\Column(type: Types::BOOLEAN)]
    protected $active;
    #[ORM\Column(type: Types::BOOLEAN)]
    protected $global;
    #[ORM\OneToMany(targetEntity: 'Project', mappedBy: 'customer')]
    protected $projects;
    #[ORM\OneToMany(targetEntity: 'Entry', mappedBy: 'customer')]
    protected $entries;

    #[ORM\ManyToMany(targetEntity: 'Team', mappedBy: 'customers')]
    protected $teams;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
        $this->entries  = new ArrayCollection();
        $this->teams    = new ArrayCollection();
    }

    /**
     * Set id.
     *
     * @param int $id
     *
     * @return $this
     */
    public function setId(int $id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get id.
     *
     * @return int $id
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Set name.
     *
     * @param string $name
     *
     * @return $this
     */
    public function setName(string $name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string $name
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * Set active.
     *
     * @param bool $active
     *
     * @return $this
     */
    public function setActive(bool $active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * Get active.
     *
     * @return bool $active
     */
    public function getActive(): bool
    {
        return $this->active;
    }

    /**
     * Set global.
     *
     * @param bool $global
     *
     * @return $this
     */
    public function setGlobal(bool $global)
    {
        $this->global = $global;

        return $this;
    }

    /**
     * Get global.
     *
     * @return bool $global
     */
    public function getGlobal(): bool
    {
        return $this->global;
    }

    /**
     * Add projects.
     *
     * @return $this
     */
    public function addProjects(Project $projects)
    {
        $this->projects[] = $projects;

        return $this;
    }

    /**
     * Get projects.
     *
     * @return Collection $projects
     */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    /**
     * Add entries.
     *
     * @return $this
     */
    public function addEntries(Entry $entries)
    {
        $this->entries[] = $entries;

        return $this;
    }

    /**
     * Get entries.
     *
     * @return Collection $entries
     */
    public function getEntries(): Collection
    {
        return $this->entries;
    }

    /**
     * Reset teams.
     *
     * @return $this
     */
    public function resetTeams()
    {
        $this->teams = new ArrayCollection();

        return $this;
    }

    /**
     * Add team.
     *
     * @return $this
     */
    public function addTeam(Team $team)
    {
        $this->teams[] = $team;

        return $this;
    }

    /**
     * Get teams.
     *
     * @return Collection $teams
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    /**
     * Add projects.
     *
     * @return Customer
     */
    public function addProject(Project $projects): self
    {
        $this->projects[] = $projects;

        return $this;
    }

    /**
     * Remove projects.
     */
    public function removeProject(Project $projects): void
    {
        $this->projects->removeElement($projects);
    }

    /**
     * Add entries.
     *
     * @return Customer
     */
    public function addEntry(Entry $entry): self
    {
        $this->entries[] = $entry;

        return $this;
    }

    /**
     * Remove entry.
     */
    public function removeEntrie(Entry $entry): void
    {
        $this->entries->removeElement($entry);
    }

    /**
     * Remove teams.
     */
    public function removeTeam(Team $teams): void
    {
        $this->teams->removeElement($teams);
    }

    /**
     * Add entries.
     *
     * @return Customer
     */
    public function addEntrie(Entry $entries): self
    {
        $this->entries[] = $entries;

        return $this;
    }
}
